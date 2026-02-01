
export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center w-full h-32">
            <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-white/10 border-t-portal-accent rounded-full animate-spin"></div>
        </div>
    );
}
