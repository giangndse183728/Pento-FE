'use client';

import React, { useState } from 'react';
import AchievementsList from './AchievementsList';
import CreateAchievements from './CreateAchievements';
import ActivitiesList from './ActivitiesList';
import CreateRequirements from './CreateRequirements';

export default function AchievementsManager() {
    const [currentStep, setCurrentStep] = useState<'create' | 'list' | 'activities' | 'requirements'>('list');

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-semibold" style={{ color: '#113F67' }}>Achievements Manager</h1>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex justify-start">
                <div className="segmented">
                    <label className="segmented-button">
                        <input
                            type="radio"
                            name="achievement-tab"
                            checked={currentStep === 'list'}
                            onChange={() => setCurrentStep('list')}
                        />
                        Achievements List
                    </label>
                    <label className="segmented-button">
                        <input
                            type="radio"
                            name="achievement-tab"
                            checked={currentStep === 'activities'}
                            onChange={() => setCurrentStep('activities')}
                        />
                        Activities List
                    </label>
                    <label className="segmented-button">
                        <input
                            type="radio"
                            name="achievement-tab"
                            checked={currentStep === 'create'}
                            onChange={() => setCurrentStep('create')}
                        />
                        Create Achievement
                    </label>

                    <label className="segmented-button">
                        <input
                            type="radio"
                            name="achievement-tab"
                            checked={currentStep === 'requirements'}
                            onChange={() => setCurrentStep('requirements')}
                        />
                        Create Requirements
                    </label>

                </div>
            </div>

            {/* Create Achievement Tab */}
            {currentStep === 'create' && (
                <CreateAchievements onSuccess={() => setCurrentStep('list')} />
            )}

            {/* Achievements List Tab */}
            {currentStep === 'list' && (
                <AchievementsList />
            )}

            {/* Activities Tab */}
            {currentStep === 'activities' && (
                <ActivitiesList />
            )}

            {/* Create Requirements Tab */}
            {currentStep === 'requirements' && (
                <CreateRequirements />
            )}
        </div>
    );
}
