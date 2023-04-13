
export default function ButtonAddBasic({ label, onClick }: {label: string, onClick?: Function}) {
    return(
        <div className={`h-12 w-fit px-2 rounded-lg flex justify-items-center items-center bg-slate-300 border-2
         border-slate-400 hover:bg-slate-400 hover:border-slate-500 hover:cursor-pointer`}
            
         onClick={() => { onClick && onClick() }}
         >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <div className="font-semibold text-sm ml-1">
                { label }
            </div>
        </div>
  ) 
}