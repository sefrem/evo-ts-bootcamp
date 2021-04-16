import React from 'react';

import {Images} from "./shared/types";
import useDebounce from "./hooks/useDebounce";
import {getImages} from "./api";

import Spinner from "./components/Spinner/Spinner";
import Gallery from "./components/Gallery/Gallery";

import styles from './App.module.css';

function App(): JSX.Element {
    const [images, setImages] = React.useState<Images[]>([]);
    const [search, setSearch] = React.useState<string>('tree');
    const [loader, setLoader] = React.useState<boolean>(false);

    const debouncedSearchTerm = useDebounce(search, 500);

    React.useEffect(() => {

        const fetch = async (): Promise<void> => {
            setLoader(true)
            const images = await getImages(debouncedSearchTerm);
            setImages(images)
            setLoader(false)
        }
        fetch()
    }, [debouncedSearchTerm])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => setSearch(e.target.value)

    return (
        <div className={styles.app}>
            <h1>Metropolitan Museum of Art database</h1>

            <div>
                <label htmlFor='search'>Type in to search:</label>
                {' '}
                <input type='text' id='search' onChange={onChange} value={search}/>
            </div>

            {loader && <Spinner/>}

            <Gallery images={images} />

        </div>
    );
}

export default App;





