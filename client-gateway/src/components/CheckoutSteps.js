// src/components/CheckoutSteps.js
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle, Circle } from 'lucide-react';

const CheckoutSteps = ({ step1, step2, step3 }) => {
    const steps = [
        { 
            id: 1, 
            name: 'Shipping', 
            path: '/shipping',
            icon: MapPin,
            active: step1 
        },
        { 
            id: 2, 
            name: 'Review Order', 
            path: '/placeorder',
            icon: CreditCard,
            active: step2 
        },
        { 
            id: 3, 
            name: 'Confirmation', 
            path: '/order',
            icon: CheckCircle,
            active: step3 
        },
    ];

    return (
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index === 0 ? step1 : index === 1 ? step2 : step3;
                        const isPending = !isCompleted;

                        return (
                            <React.Fragment key={step.id}>
                                {/* Step */}
                                <div className="flex items-center space-x-3">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                                        isCompleted 
                                            ? 'bg-green-100 text-green-600' 
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {isCompleted ? (
                                            <CheckCircle size={24} />
                                        ) : (
                                            <Circle size={24} />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        {isCompleted ? (
                                            <Link 
                                                to={step.path}
                                                className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                                            >
                                                {step.name}
                                            </Link>
                                        ) : (
                                            <span className={`text-sm font-semibold ${isPending ? 'text-gray-500' : 'text-gray-900'}`}>
                                                {step.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className={`flex-grow h-1 mx-2 transition-colors ${
                                        isCompleted ? 'bg-green-200' : 'bg-gray-200'
                                    }`}></div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CheckoutSteps;