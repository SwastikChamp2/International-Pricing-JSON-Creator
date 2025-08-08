import React, { useState } from 'react';
import { Copy, DollarSign, Package, Globe, Calculator } from 'lucide-react';

export default function CurrencyConverter() {
    const [packages, setPackages] = useState({
        starter: 99,
        pro: 199,
        business: 299,
        enterprise: 499,
        hosting1Month: 15,
        hosting3Month: 12,
        hosting6Month: 9,
        hosting12Month: 6
    });

    const [targetCurrencies, setTargetCurrencies] = useState('AED, ARS, AUD');
    const [convertedData, setConvertedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [roundNumbers, setRoundNumbers] = useState(false);
    const [error, setError] = useState('');

    const handlePackageChange = (packageName, value) => {
        setPackages(prev => ({
            ...prev,
            [packageName]: value === '' ? 0 : parseFloat(value) || 0
        }));
    };

    const addPackage = () => {
        const newPackageName = prompt('Enter package name:');
        if (newPackageName && !packages[newPackageName]) {
            setPackages(prev => ({
                ...prev,
                [newPackageName]: 0
            }));
        }
    };

    const removePackage = (packageName) => {
        setPackages(prev => {
            const newPackages = { ...prev };
            delete newPackages[packageName];
            return newPackages;
        });
    };

    const convertCurrencies = async () => {
        setLoading(true);
        setError('');

        try {
            const currencies = targetCurrencies.split(',').map(c => c.trim().toUpperCase()).filter(c => c);

            if (currencies.length === 0) {
                throw new Error('Please enter at least one target currency');
            }

            // Using exchangerate-api.com (free tier)
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');

            if (!response.ok) {
                throw new Error('Failed to fetch exchange rates');
            }

            const data = await response.json();
            const rates = data.rates;

            const result = {};

            // Add USD as base currency
            result.USD = { ...packages };

            currencies.forEach(currency => {
                if (rates[currency]) {
                    result[currency] = {};
                    Object.entries(packages).forEach(([packageName, price]) => {
                        const convertedPrice = price * rates[currency];
                        result[currency][packageName] = roundNumbers ? Math.round(convertedPrice) : Math.round(convertedPrice * 100) / 100;
                    });
                }
            });

            setConvertedData(result);
        } catch (err) {
            setError(err.message || 'An error occurred during conversion');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (convertedData) {
            navigator.clipboard.writeText(JSON.stringify(convertedData, null, 4));
            alert('Copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <Calculator className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">International Pricing JSON Creator</h1>
                    </div>

                    {/* Package Management Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-xl font-semibold text-gray-700">Package Prices (USD)</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {Object.entries(packages).map(([packageName, price]) => (
                                <div key={packageName} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            {packageName}
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={price}
                                                onChange={(e) => handlePackageChange(packageName, e.target.value)}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removePackage(packageName)}
                                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addPackage}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            + Add Package
                        </button>
                    </div>

                    {/* Target Currencies Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-xl font-semibold text-gray-700">Target Currencies</h2>
                        </div>

                        <input
                            type="text"
                            value={targetCurrencies}
                            onChange={(e) => setTargetCurrencies(e.target.value)}
                            placeholder="Enter currencies separated by commas (e.g., AED, ARS, AUD)"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />

                        <div className="flex items-center gap-2 mt-3">
                            <input
                                type="checkbox"
                                id="roundNumbers"
                                checked={roundNumbers}
                                onChange={(e) => setRoundNumbers(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="roundNumbers" className="text-sm text-gray-600">
                                Round to nearest whole number
                            </label>
                        </div>
                    </div>

                    {/* Convert Button */}
                    <div className="mb-8">
                        <button
                            onClick={convertCurrencies}
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Converting...' : 'Convert Currencies'}
                        </button>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Results Section */}
                    {convertedData && (
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-700">Converted Prices</h2>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy JSON
                                </button>
                            </div>

                            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
                                <pre className="text-sm">
                                    {JSON.stringify(convertedData, null, 4)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}