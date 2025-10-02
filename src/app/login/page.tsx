import Silk from '@/features/auth/components/Silk';
import GlassSurface from '@/components/decoration/Liquidglass';
import { LoginForm } from '@/features/auth/components/login-form';

export default function Login() {
    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: "#D4EBF8" }}>

                <Silk />
            </div>
            <div className="absolute inset-0 z-10 font-sans flex items-center justify-center p-8 sm:p-20">
                <GlassSurface
                    width={500}
                    height={500}
                    borderRadius={24}
                    backgroundOpacity={0.18}
                    className="p-6"
                >
                    <div className="w-full h-full flex items-start justify-center pt-8">
                        <LoginForm className="w-[100%]" />
                    </div>
                </GlassSurface>

            </div>
        </div>
    );
}

