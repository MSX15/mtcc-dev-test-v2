
export default function CardBasic({ entity, header }: {entity: any, header: string | undefined}) {
    // const { [header]: entityHeader, ...entityToFlex } = entity 

    return(
        <div className="bg-white w-full border-2 rounded-xl border-slate-300 p-3">
            {
                header &&
                (

                    <h3 className="font-semibold text-lg border-b-2 border-slate-300">{entity[header]}</h3>
                )
            }
            <div className="flex gap-3">
                {
                    Object.keys(entity).filter(x => !x.startsWith('_') 
                        && !Array.isArray(entity[x])
                        && !(typeof entity[x] === 'object')
                    ).map((x,i) => 
                        <div key={i} className="flex flex-col">
                            <div className="font-semibold capitalize">{x}</div>
                            <div className="">{entity[x]}</div>
                        </div>
                    )
                }
            </div>
        </div>
  ) 
}