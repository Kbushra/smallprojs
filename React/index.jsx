//To see definitions
/*
import React from 'react';
import ReactDOM from 'react-dom/client';
*/
const { Suspense, useState } = React;

function Disc()
{
    this.ready = false;
    if (ready) { return (<p className='disc'>This should be a disc</p>); }
    
    throw new Promise((next) => { setTimeout(next, 1000); })
    .then(() =>
    {
        this.ready = true;
    });
}

let root = document.getElementById("react");
ReactDOM.render(
    <Suspense fallback="Loading disc...">
        <Disc />
    </Suspense>,
root);