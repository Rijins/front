import { css } from '@emotion/react';
import React, { useState } from 'react'
import HashLoader from "react-spinners/HashLoader";

function Loader() {
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");
    const override = css`
    display: "block",
  margin: "0 auto",
  borderColor: "red",`
        ;

    return (
        <div className='center-container'>
            <div className="sweet-loading">
                <HashLoader
                    color='#000'
                    loading={loading}
                    css={override}
                    size={80}
                />
            </div>
        </div>

    )
}

export default Loader