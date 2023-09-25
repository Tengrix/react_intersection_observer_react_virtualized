import {useInView} from "react-intersection-observer";
import useFetch, {AlbumType} from "./useFetch";
import {useEffect, useState} from "react";
import {List, AutoSizer, CellMeasurer, CellMeasurerCache, ListRowRenderer} from 'react-virtualized';
import './App.css'

const rowHeight = 50;
const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100
});

function App() {
    const {ref, inView} = useInView({
        threshold: 1
    })
    const [data, setData] = useState<AlbumType[]>([])
    const [page, setPage] = useState<number>(1)

    const {albums} = useFetch('https://jsonplaceholder.typicode.com/posts', page)
    useEffect(() => {
        if (albums) {
            setData((prev) => [...prev, ...albums])
        }
    }, [albums])
    useEffect(() => {
        if (inView && albums.length > 0) {
            setPage((prev) => prev + 1)
        }
    }, [inView])

    const renderRow: ListRowRenderer = ({index, key, style,parent}) => {
        console.log(style)
        return (
            <CellMeasurer
                key={key}
                cache={cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}>
                {({registerChild}) => (
                    <div key={key} style={style} className="row" ref={registerChild as any}>
                        <div className="image">
                            <img src={data[index].url} alt=""/>
                        </div>
                        <div className="content">
                            <div>{data[index].id}</div>
                            <div>{data[index].title}</div>
                        </div>
                        {index === data.length - 1 && <div ref={ref}/>}
                    </div>
                )}
            </CellMeasurer>
        )
    }
    return (
        <div className="App">
            <div className="list">
                <AutoSizer>
                    {({width, height}) =>{
                        // console.log(width,height)
                        return <List
                            width={width}
                            height={height}
                            deferredMeasurementCache={cache}
                            rowHeight={rowHeight}
                            rowRenderer={renderRow}
                            rowCount={data.length}
                            overscanRowCount={3}/>
                    }}
                </AutoSizer>
            </div>
        </div>
    )
}

export default App
