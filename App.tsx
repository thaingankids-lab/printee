import React, { useState } from 'react';
import { GoogleGenAI as GenerativeClient, Modality } from '@google/genai';
import { CITIES } from './constants';
import { UploadIcon, SparklesIcon, DownloadIcon, XCircleIcon } from './components/Icons';
import { Spinner } from './components/Spinner';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const downloadImage = (base64Data: string, filename: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [passwordInput, setPasswordInput] = useState<string>('');
    const [authError, setAuthError] = useState<string | null>(null);

    const [userApiKey, setUserApiKey] = useState<string>('');
    const [apiKeyStatus, setApiKeyStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
    const [apiKeyMessage, setApiKeyMessage] = useState<string>('');

    const [referenceImage, setReferenceImage] = useState<string | null>(null);
    const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
    const [selectedCity, setSelectedCity] = useState<string>(CITIES[0]);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getApiKey = () => userApiKey.trim() || (process.env.API_KEY as string | undefined) || '';

    const requireApiKey = () => {
        const apiKey = getApiKey();
        if (!apiKey) {
            setError('Vui lòng nhập API key trước khi sử dụng.');
            return null;
        }
        return apiKey;
    };

    const handleClearApiKey = () => {
        setUserApiKey('');
        setApiKeyStatus('idle');
        setApiKeyMessage('');
        setGeneratedImage(null);
        setError(null);
    };

    const handleTestApiKey = async () => {
        const apiKey = requireApiKey();
        if (!apiKey) {
            setApiKeyStatus('invalid');
            setApiKeyMessage('Chưa có API key để test.');
            return;
        }

        setApiKeyStatus('testing');
        setApiKeyMessage('');
        setError(null);

        try {
            const ai = new GenerativeClient({ apiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: 'ping',
            });

            if (!response.text) {
                throw new Error('API key hoạt động nhưng không nhận được phản hồi kiểm tra.');
            }

            setApiKeyStatus('valid');
            setApiKeyMessage('API key hợp lệ và có thể sử dụng.');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể kiểm tra API key.';
            setApiKeyStatus('invalid');
            setApiKeyMessage(message);
            setError(message);
        }
    };

    const handlePasswordSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (passwordInput === 'printee@1234') {
            setIsAuthenticated(true);
            setAuthError(null);
        } else {
            setAuthError('Mật khẩu không đúng. Vui lòng thử lại.');
            setPasswordInput('');
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setReferenceImageFile(file);
        setReferenceImage(URL.createObjectURL(file));
        setGeneratedImage(null);
        setError(null);
    };

    const handleGenerateClick = async () => {
        const apiKey = requireApiKey();
        if (!apiKey) {
            return;
        }

        if (!referenceImageFile) {
            setError('Vui lòng tải lên ảnh mẫu trước.');
            return;
        }

        setIsGenerating(true);
        setGeneratedImage(null);
        setError(null);

        try {
            const ai = new GenerativeClient({ apiKey });
            const base64Data = await fileToBase64(referenceImageFile);
            const prompt = `
Role: Senior Graphic Designer.
Task: Create a high-quality poster graphic for the city: "${selectedCity}".

Use the uploaded image as the visual style reference. Match its graphic design language closely: composition, color mood, typography feel, illustration style, lighting, texture, print-like finish, and overall visual character.

Instructions:
1. Feature iconic landmarks, visual symbols, or atmosphere of "${selectedCity}".
2. Include the main text "${selectedCity}" naturally inside the artwork.
3. Keep the result polished, professional, and suitable for poster or print use.
4. Do not create a simple photo filter; create a new original graphic inspired by the reference style.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: base64Data, mimeType: referenceImageFile.type } },
                        { text: prompt },
                    ],
                },
                config: { responseModalities: [Modality.IMAGE] },
            });

            const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
            if (imagePart?.inlineData) {
                setGeneratedImage(imagePart.inlineData.data);
                return;
            }

            const blockReason = response.promptFeedback?.blockReason;
            const responseText = response.text;
            let errorMessage = 'Không nhận được dữ liệu hình ảnh từ hệ thống xử lý.';

            if (blockReason) {
                errorMessage = `Yêu cầu tạo ảnh bị chặn vì lý do: ${blockReason}.`;
                if (responseText) {
                    errorMessage += ` Chi tiết: ${responseText}`;
                }
            } else if (responseText) {
                errorMessage = `Không thể tạo ảnh. Phản hồi từ API: "${responseText}"`;
            }

            throw new Error(errorMessage);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Không thể tạo hình ảnh. Vui lòng thử lại.');
        } finally {
            setIsGenerating(false);
        }
    };

    const renderPasswordScreen = () => (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-sm text-center">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
                    Yêu cầu xác thực
                </h2>
                <p className="text-gray-400 mb-6">Vui lòng nhập mật khẩu để tiếp tục.</p>
                <form onSubmit={handlePasswordSubmit}>
                    <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Mật khẩu"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-4"
                        aria-label="Password"
                    />
                    {authError && <p className="text-red-400 text-sm mb-4">{authError}</p>}
                    <button
                        type="submit"
                        className="w-full px-6 py-3 font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all transform hover:scale-105"
                    >
                        Truy cập
                    </button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            {!isAuthenticated ? renderPasswordScreen() : (
                <div className="max-w-7xl mx-auto">
                    <header className="text-center mb-8">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                            Printee Design Graphic <span className="text-xs bg-gray-700 text-cyan-400 px-2 py-1 rounded align-middle ml-2 border border-cyan-500/30">Hoang Nguyen</span>
                        </h1>
                        <p className="mt-2 text-lg text-gray-400">Tạo graphic độc đáo cho các thành phố Việt Nam từ ảnh mẫu của bạn.</p>
                        <p className="mt-2 text-sm text-gray-500">Ban quyen thuoc ve Hoang Nguyen. Cam sao chep noi dung app duoi moi hinh thuc. Viet app theo yeu cau lien he 0931325512.</p>
                    </header>

                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6 flex items-center" role="alert">
                            <XCircleIcon className="w-5 h-5 mr-3" />
                            <span className="block sm:inline whitespace-pre-wrap">{error}</span>
                            <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-4 border-b-2 border-cyan-500 pb-2">1. Nhập API Key</h2>
                                <div className="space-y-3">
                                    <input
                                        type="password"
                                        value={userApiKey}
                                        onChange={(e) => {
                                            setUserApiKey(e.target.value);
                                            setApiKeyStatus('idle');
                                            setApiKeyMessage('');
                                            if (error === 'Vui lòng nhập API key trước khi sử dụng.') {
                                                setError(null);
                                            }
                                        }}
                                        placeholder="Nhập API key của bạn"
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                                        <p className="text-xs text-gray-500">Key chỉ giữ tạm trong phiên làm việc này, không lưu vào trình duyệt.</p>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleTestApiKey}
                                                className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={apiKeyStatus === 'testing'}
                                            >
                                                {apiKeyStatus === 'testing' ? 'Đang test...' : 'Test API key'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleClearApiKey}
                                                className="px-4 py-2 text-sm font-semibold text-gray-200 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={!userApiKey && !generatedImage}
                                            >
                                                Xóa API key
                                            </button>
                                        </div>
                                    </div>
                                    {apiKeyMessage && (
                                        <p className={`text-sm ${apiKeyStatus === 'valid' ? 'text-green-400' : 'text-red-400'}`}>
                                            {apiKeyMessage}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 border-b-2 border-cyan-500 pb-2">2. Tải Lên Ảnh Mẫu</h2>
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <UploadIcon className="w-10 h-10 mb-3 text-gray-400"/>
                                            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Nhấn để tải lên</span> hoặc kéo thả</p>
                                            <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </div>

                            {referenceImage && (
                                <div className="animate-fade-in">
                                    <h3 className="text-xl font-semibold mb-2">Ảnh Mẫu</h3>
                                    <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center p-1 border border-gray-700">
                                        <img src={referenceImage} alt="Reference" className="rounded object-contain max-h-full max-w-full"/>
                                    </div>
                                </div>
                            )}

                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold mb-4 border-b-2 border-cyan-500 pb-2">3. Tạo Graphic Mới</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="city-select" className="block text-sm font-medium text-gray-400 mb-1">Chọn thành phố</label>
                                        <select
                                            id="city-select"
                                            value={selectedCity}
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        >
                                            {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleGenerateClick}
                                        disabled={!referenceImageFile || isGenerating}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                                    >
                                        {isGenerating ? <><Spinner /> Đang tạo...</> : <><SparklesIcon/> Tạo Ảnh</>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 space-y-6">
                            <h2 className="text-2xl font-bold mb-4 border-b-2 border-purple-500 pb-2">Kết Quả</h2>
                            {isGenerating &&
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                                    <Spinner large />
                                    <p className="mt-4 text-purple-400">Đang tạo ảnh, vui lòng chờ...</p>
                                </div>
                            }
                            {generatedImage && !isGenerating && (
                                <div className="space-y-6 animate-fade-in">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Ảnh Graphic: {selectedCity}</h3>
                                        <div className="relative group">
                                            <img src={`data:image/png;base64,${generatedImage}`} alt={`Generated graphic for ${selectedCity}`} className="rounded-lg w-full object-contain shadow-lg shadow-purple-900/20" />
                                            <button onClick={() => downloadImage(generatedImage, `${selectedCity}_graphic.png`)} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity opacity-0 group-hover:opacity-100">
                                                <DownloadIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!generatedImage && !isGenerating &&
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center text-gray-500">
                                    <SparklesIcon className="w-16 h-16 mb-4"/>
                                    <p>Kết quả của bạn sẽ xuất hiện ở đây.</p>
                                </div>
                            }
                        </div>
                    </div>

                    <footer className="mt-8 border-t border-gray-800 pt-4 text-center text-xs text-gray-500">
                        Ban quyen thuoc ve Hoang Nguyen. Cam sao chep noi dung app duoi moi hinh thuc. Viet app theo yeu cau lien he 0931325512.
                    </footer>
                </div>
            )}
        </div>
    );
};

export default App;
