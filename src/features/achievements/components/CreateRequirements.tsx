'use client';

import { useState } from 'react';
import { useCreateMilestoneRequirement } from '../hooks/useMilestones';
import { useActivities } from '../hooks/useActivities';
import { useMilestones } from '../hooks/useMilestones';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import { Field, FieldLabel, FieldContent } from '@/components/ui/field';
import { ColorTheme } from '@/constants/color';
import { toast } from 'sonner';
import ElasticSlider from '@/components/decoration/ElasticSlider';
import { CirclePlus, CircleMinus, Check, ChevronsUpDown } from 'lucide-react';
import '@/styles/toggle.css';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function CreateRequirements() {
    const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');
    const [selectedActivityCode, setSelectedActivityCode] = useState<string>('');
    const [quota, setQuota] = useState<number>(1);
    const [withinDays, setWithinDays] = useState<number | undefined>(undefined);
    const [hasDeadline, setHasDeadline] = useState<boolean>(false);
    const [milestoneOpen, setMilestoneOpen] = useState<boolean>(false);
    const [activityOpen, setActivityOpen] = useState<boolean>(false);

    const { data: milestonesData } = useMilestones({ pageSize: 50 });
    const { data: activities = [] } = useActivities();
    const createRequirement = useCreateMilestoneRequirement();

    const milestones = (milestonesData?.items || []).filter((milestone) => !milestone.isDeleted);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedMilestoneId || !selectedActivityCode) {
            toast.error('Please select both a milestone and an activity');
            return;
        }

        if (quota < 1) {
            toast.error('Quota must be at least 1');
            return;
        }

        if (hasDeadline && (!withinDays || withinDays < 0)) {
            toast.error('Please enter a valid number of days');
            return;
        }

        try {
            const payload = {
                activityCode: selectedActivityCode,
                quota,
                ...(hasDeadline && { withinDays }),
            };

            await createRequirement.mutateAsync({
                milestoneId: selectedMilestoneId,
                payload,
            });

            toast.success('Requirement created successfully');
            setSelectedMilestoneId('');
            setSelectedActivityCode('');
            setQuota(1);
            setWithinDays(undefined);
            setHasDeadline(false);
        } catch (err) {
            console.error('Failed to create requirement:', err);
            toast.error('Failed to create requirement');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: ColorTheme.darkBlue }}>
                    Create Achievement Requirement
                </h2>
            </div>

            <WhiteCard className="w-full" width="100%" height="auto">
                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Milestone and Activity Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Milestone Selection */}
                        <Field>
                            <FieldLabel
                                className="font-semibold text-xl"
                                style={{ color: ColorTheme.darkBlue }}
                            >
                                Select Milestone *
                            </FieldLabel>

                            <FieldContent>
                                <Popover open={milestoneOpen} onOpenChange={setMilestoneOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={milestoneOpen}
                                            className="w-full justify-between neomorphic-input h-12"
                                        >
                                            {selectedMilestoneId
                                                ? milestones.find((m) => m.id === selectedMilestoneId)?.name
                                                : "Choose a milestone..."}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search milestone..." className="h-9" />

                                            <CommandList>
                                                <CommandEmpty>No milestone found.</CommandEmpty>

                                                {/* Split into 2 columns with divider */}
                                                <div className="grid grid-cols-2 divide-x">
                                                    {/* Left column */}
                                                    <CommandGroup>
                                                        {milestones
                                                            .slice(0, Math.ceil(milestones.length / 2))
                                                            .map((milestone) => (
                                                                <CommandItem
                                                                    key={milestone.id}
                                                                    value={milestone.name}
                                                                    onSelect={() => {
                                                                        setSelectedMilestoneId(
                                                                            milestone.id === selectedMilestoneId
                                                                                ? ''
                                                                                : milestone.id
                                                                        );
                                                                        setMilestoneOpen(false);
                                                                    }}
                                                                >
                                                                    <span className={!milestone.isActive ? "opacity-50 italic" : ""}>
                                                                        {milestone.name}
                                                                    </span>

                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            selectedMilestoneId === milestone.id
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                    </CommandGroup>

                                                    {/* Right column */}
                                                    <CommandGroup>
                                                        {milestones
                                                            .slice(Math.ceil(milestones.length / 2))
                                                            .map((milestone) => (
                                                                <CommandItem
                                                                    key={milestone.id}
                                                                    value={milestone.name}
                                                                    onSelect={() => {
                                                                        setSelectedMilestoneId(
                                                                            milestone.id === selectedMilestoneId
                                                                                ? ''
                                                                                : milestone.id
                                                                        );
                                                                        setMilestoneOpen(false);
                                                                    }}
                                                                >
                                                                    <span className={!milestone.isActive ? "opacity-50 italic" : ""}>
                                                                        {milestone.name}
                                                                    </span>

                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            selectedMilestoneId === milestone.id
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                    </CommandGroup>
                                                </div>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FieldContent>
                        </Field>


                        {/* Activity Selection */}
                        <Field>
                            <FieldLabel className="font-semibold text-xl" style={{ color: ColorTheme.darkBlue }}>
                                Select Activity *
                            </FieldLabel>
                            <FieldContent>
                                <Popover open={activityOpen} onOpenChange={setActivityOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={activityOpen}
                                            className="w-full justify-between neomorphic-input h-12"
                                        >
                                            {selectedActivityCode
                                                ? activities.find((a) => a.activityCode === selectedActivityCode)?.name +
                                                ' (' + activities.find((a) => a.activityCode === selectedActivityCode)?.activityCode + ')'
                                                : "Choose an activity..."}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search activity..." className="h-9" />

                                            <CommandList>
                                                <CommandEmpty>No activity found.</CommandEmpty>

                                                {/* Two-column layout container */}
                                                <div className="grid grid-cols-2 divide-x">
                                                    {/* Left column */}
                                                    <CommandGroup>
                                                        {activities
                                                            .slice(0, Math.ceil(activities.length / 2))
                                                            .map((activity) => (
                                                                <CommandItem
                                                                    key={activity.activityCode}
                                                                    value={activity.name}
                                                                    onSelect={() => {
                                                                        setSelectedActivityCode(
                                                                            activity.activityCode === selectedActivityCode
                                                                                ? ''
                                                                                : activity.activityCode
                                                                        );
                                                                        setActivityOpen(false);
                                                                    }}
                                                                >
                                                                    {activity.name}

                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            selectedActivityCode === activity.activityCode
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                    </CommandGroup>

                                                    {/* Right column */}
                                                    <CommandGroup>
                                                        {activities
                                                            .slice(Math.ceil(activities.length / 2))
                                                            .map((activity) => (
                                                                <CommandItem
                                                                    key={activity.activityCode}
                                                                    value={activity.name}
                                                                    onSelect={() => {
                                                                        setSelectedActivityCode(
                                                                            activity.activityCode === selectedActivityCode
                                                                                ? ''
                                                                                : activity.activityCode
                                                                        );
                                                                        setActivityOpen(false);
                                                                    }}
                                                                >
                                                                    {activity.name}

                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            selectedActivityCode === activity.activityCode
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                    </CommandGroup>
                                                </div>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>

                                </Popover>
                            </FieldContent>
                        </Field>
                    </div>

                    {/* Deadline Toggle */}
                    <div className="flex items-center gap-3">
                        <FieldLabel className="font-semibold text-xl mb-0" style={{ color: ColorTheme.darkBlue }}>
                            Set a deadline
                        </FieldLabel>

                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={hasDeadline}
                                onChange={(e) => {
                                    setHasDeadline(e.target.checked);
                                    if (!e.target.checked) setWithinDays(undefined);
                                }}
                            />
                            <span className="slider"></span>
                        </label>

                        <span
                            className="font-semibold"
                            style={{
                                color: hasDeadline ? '#67C090' : '#FFA07A',
                                fontSize: "1.1rem"
                            }}
                        >
                            {hasDeadline ? 'Yes' : 'No'}
                        </span>
                    </div>

                    {/* 2-Column Layout for Sliders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quota Slider */}
                        <Field>
                            <FieldLabel className="font-semibold text-xl" style={{ color: ColorTheme.darkBlue }}>
                                Quota *
                            </FieldLabel>

                            <FieldContent>
                                <div className="flex gap-3 items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setQuota(Math.max(1, quota - 1))}
                                        className="p-2 hover:scale-110 transition-transform flex-shrink-0"
                                    >
                                        <CircleMinus className="w-5 h-5" />
                                    </button>

                                    <div className="flex-1 flex items-center">
                                        <ElasticSlider
                                            defaultValue={quota}
                                            startingValue={1}
                                            maxValue={100}
                                            isStepped={true}
                                            stepSize={1}
                                            onChange={(val) => setQuota(val)}
                                            valueFormatter={(val) => `${val.toLocaleString()} ${val === 1 ? 'time' : 'times'}`}
                                            leftIcon={<span />}
                                            rightIcon={<span />}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setQuota(Math.min(100, quota + 1))}
                                        className="p-2 hover:scale-110 transition-transform flex-shrink-0"
                                    >
                                        <CirclePlus className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500 mt-1">
                                    Times the activity must be completed
                                </p>
                            </FieldContent>
                        </Field>

                        {/* Within Days Slider */}
                        {hasDeadline && (
                            <Field>
                                <FieldLabel className="font-semibold text-xl" style={{ color: ColorTheme.darkBlue }}>
                                    Within Days
                                </FieldLabel>

                                <FieldContent>
                                    <div className="flex gap-3 items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setWithinDays(Math.max(1, (withinDays ?? 1) - 1))}
                                            className="p-2 hover:scale-110 transition-transform flex-shrink-0"
                                        >
                                            <CircleMinus className="w-5 h-5" />
                                        </button>

                                        <div className="flex-1 flex items-center">
                                            <ElasticSlider
                                                defaultValue={withinDays ?? 1}
                                                startingValue={1}
                                                maxValue={365}
                                                isStepped={true}
                                                stepSize={1}
                                                onChange={(val) => setWithinDays(val)}
                                                valueFormatter={(val) => `${val.toLocaleString()} ${val === 1 ? 'day' : 'days'}`}
                                                leftIcon={<span />}
                                                rightIcon={<span />}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setWithinDays(Math.min(366, (withinDays ?? 1) + 1))}
                                            className="p-2 hover:scale-110 transition-transform flex-shrink-0"
                                        >
                                            <CirclePlus className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Number of days to complete the requirement
                                    </p>
                                </FieldContent>
                            </Field>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <CusButton
                            type="submit"
                            variant="blueGray"
                            disabled={createRequirement.isPending || !selectedMilestoneId || !selectedActivityCode}
                            className="flex-1"
                        >
                            {createRequirement.isPending ? 'Creating...' : 'Create Requirement'}
                        </CusButton>
                    </div>

                    {/* Summary */}
                    {selectedMilestoneId && selectedActivityCode && (
                        <div
                            className="p-4 rounded-lg border"
                            style={{ borderColor: '#D6E6F2', backgroundColor: '#F0F8FF' }}
                        >
                            <p className="text-sm" style={{ color: ColorTheme.darkBlue }}>
                                <strong>Summary:</strong> To earn this milestone, users must complete{' '}
                                <strong>{quota}</strong> instance(s) of{' '}
                                <strong>
                                    {activities.find((a) => a.activityCode === selectedActivityCode)?.name}
                                </strong>
                                {hasDeadline && withinDays && ` within ${withinDays} days`}.
                            </p>
                        </div>
                    )}
                </form>
            </WhiteCard>
        </div>
    );
}
