import { useState } from 'react';
import { 
    AdjustmentsHorizontalIcon,
    SunIcon,
    MoonIcon,
    MagnifyingGlassPlusIcon,
    MagnifyingGlassMinusIcon
} from '@heroicons/react/24/outline';

function AccessibilityMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [highContrast, setHighContrast] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const increaseFontSize = () => {
        const newSize = Math.min(fontSize + 10, 150);
        setFontSize(newSize);
        document.documentElement.style.fontSize = `${newSize}%`;
    };

    const decreaseFontSize = () => {
        const newSize = Math.max(fontSize - 10, 80);
        setFontSize(newSize);
        document.documentElement.style.fontSize = `${newSize}%`;
    };

    const toggleHighContrast = () => {
        setHighContrast(!highContrast);
        if (!highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    const resetSettings = () => {
        setFontSize(100);
        setHighContrast(false);
        setDarkMode(false);
        document.documentElement.style.fontSize = '100%';
        document.body.classList.remove('high-contrast', 'dark-mode');
    };

    return (
        <>
            {/* Accessibility Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed left-6 bottom-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 z-50"
                aria-label="Accessibility Menu"
            >
                <AdjustmentsHorizontalIcon className="w-6 h-6" />
            </button>

            {/* Accessibility Panel */}
            {isOpen && (
                <div className="fixed left-6 bottom-24 w-80 bg-white rounded-2xl shadow-2xl z-50 animate-scale-in">
                    <div className="bg-blue-600 text-white p-4 rounded-t-2xl">
                        <h3 className="font-bold text-lg">Accessibility Options</h3>
                        <p className="text-xs text-white/80">Customize your experience</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Font Size */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Text Size
                            </label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={decreaseFontSize}
                                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    aria-label="Decrease font size"
                                >
                                    <MagnifyingGlassMinusIcon className="w-5 h-5" />
                                </button>
                                <span className="flex-1 text-center font-semibold">
                                    {fontSize}%
                                </span>
                                <button
                                    onClick={increaseFontSize}
                                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    aria-label="Increase font size"
                                >
                                    <MagnifyingGlassPlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* High Contrast */}
                        <div>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">
                                    High Contrast
                                </span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={highContrast}
                                        onChange={toggleHighContrast}
                                        className="sr-only"
                                    />
                                    <div className={`w-14 h-8 rounded-full transition-colors ${
                                        highContrast ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}>
                                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                                            highContrast ? 'translate-x-7' : 'translate-x-1'
                                        } mt-1`}></div>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Dark Mode */}
                        <div>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    {darkMode ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                                    Dark Mode
                                </span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={darkMode}
                                        onChange={toggleDarkMode}
                                        className="sr-only"
                                    />
                                    <div className={`w-14 h-8 rounded-full transition-colors ${
                                        darkMode ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}>
                                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                                            darkMode ? 'translate-x-7' : 'translate-x-1'
                                        } mt-1`}></div>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Reset Button */}
                        <button
                            onClick={resetSettings}
                            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Reset to Default
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default AccessibilityMenu;
