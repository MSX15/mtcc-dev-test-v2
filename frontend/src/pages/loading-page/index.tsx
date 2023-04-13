import AppLayout from "../../layout/AppLayout";
import CardLoadingGeneric from "../../components/card-loading-generic/card-loading-generic";

export default function LoadingPage() {
    return(
        <AppLayout>
            <h2 className="font-bold py-5 pl-5 text-3xl text-slate-700 animate-bounce"> Not quite sure what you expected huh? </h2>
            <div className="flex flex-col gap-3 px-4">
                <CardLoadingGeneric />
                <CardLoadingGeneric />
                <div className="grid grid-cols-2 gap-x-3">
                    <CardLoadingGeneric />
                    <CardLoadingGeneric />
                </div>
                <div className="grid grid-cols-3 gap-x-3">
                    <CardLoadingGeneric />
                    <CardLoadingGeneric />
                    <CardLoadingGeneric />
                </div>
                <div className="grid grid-cols-2 gap-x-3">
                    <CardLoadingGeneric />
                    <CardLoadingGeneric />
                </div>
                <CardLoadingGeneric />
                <div className="grid grid-cols-2 gap-x-3">
                    <CardLoadingGeneric />
                    <CardLoadingGeneric />
                </div>
            </div>
        </AppLayout>
  ) 
}