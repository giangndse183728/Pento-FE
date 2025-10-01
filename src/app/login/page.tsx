import LiquidEther from '@/features/auth/components/LiquidEther';
import GlassSurface from '@/components/decoration/Liquidglass';
import { LoginForm } from '@/features/auth/components/login-form';

export default function Login() {
    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: "#D4EBF8" }}>

                <LiquidEther autoResumeDelay={0} takeoverDuration={0} autoRampDuration={0} />
            </div>
            <div className="absolute inset-0 z-10 font-sans flex items-center justify-center p-8 sm:p-20">
                <GlassSurface
                    width={500}
                    height={700}
                    borderRadius={24}
                    backgroundOpacity={0.18}
                    className="p-6"
                >
                    <div className="w-full h-full flex items-center justify-center">
                        <LoginForm className="w-[90%] h-[90%]" />
                    </div>
                </GlassSurface>

            </div>
        </div>
    );
}

