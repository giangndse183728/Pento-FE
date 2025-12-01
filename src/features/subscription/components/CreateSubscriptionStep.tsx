import React from 'react';
import '@/styles/toggle.css';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import { createSubscriptionSchema } from '../schema/subscriptionSchema';

type Props = {
    form: typeof createSubscriptionSchema._type;
    inputClass: string;
    textareaClass: string;
    onChange: (patch: Partial<typeof createSubscriptionSchema._type>) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
};

const CreateSubscriptionStep = ({
    form,
    inputClass,
    textareaClass,
    onChange,
    onSubmit,
    isSubmitting,
}: Props) => {
    return (
        <WhiteCard className="w-full" width="100%" height="auto">
            <form className="space-y-5 text-[#113F67]" onSubmit={onSubmit}>
                <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full text-white grid place-items-center text-sm font-semibold" style={{ backgroundColor: '#769FCD' }}>
                        1
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold" style={{ color: '#113F67' }}>Create Subscription</h2>
                        <p className="text-sm" style={{ color: '#113F67' }}>Define the base subscription shell.</p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 text-sm">
                    <label htmlFor="subscription-active" className="font-medium" style={{ color: '#113F67' }}>
                        {form.isActive ? 'Active' : 'Inactive'}
                    </label>
                    <label className="switch">
                        <input
                            id="subscription-active"
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(e) => onChange({ isActive: e.target.checked })}
                        />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="grid gap-8">
                    <div>
                        <label className="text-sm font-semibold" style={{ color: '#113F67', fontSize: "1.1rem" }}>Name</label>
                        <input
                            className={inputClass}
                            placeholder="Premium Meal Plan"
                            value={form.name}
                            onChange={(e) => onChange({ name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold" style={{ color: '#113F67', fontSize: "1.1rem" }}>Description</label>
                        <textarea
                            className={textareaClass}
                            placeholder="Describe what is included with this subscription..."
                            value={form.description}
                            onChange={(e) => onChange({ description: e.target.value })}
                        />
                    </div>
                </div>

                <CusButton type="submit" disabled={isSubmitting} variant="blueGray">
                    {isSubmitting ? 'Saving...' : 'Create Subscription'}
                </CusButton>
            </form>
        </WhiteCard>
    );
};

export default CreateSubscriptionStep;

