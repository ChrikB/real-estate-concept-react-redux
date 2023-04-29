
import { useRef } from "react";
import { useAppSelector, useAppDispatch } from './../app/hooks';
import { useState, useEffect } from 'react';

import JSZip from 'jszip';

import { saveAs } from 'file-saver';
import {
  requestGetUsers,
} from './../components/user/userSlice';



function ExtractView(){

  require('./ExtractView.css');

  const dispatch: Function = useAppDispatch();

  const textplace = useRef<HTMLDivElement>(null!); 
    
  const users = useAppSelector(store => store.user.users);

  const [copied, setCopied] = useState(false);/* invalids */



  const copyToclipboard = ()=> {

    let txt = textplace.current.innerHTML;

    copyTextToClipboard(txt);

  };



  const copyTextToClipboard = (text: string)=> {

    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }

    navigator.clipboard.writeText(text).then(function() {
      setCopied(true);
    }, function(err) {
      setCopied(false);
    });

  };



  const fallbackCopyTextToClipboard = (text: string)=> {

    let textArea = textplace.current;

    textArea.focus();
    //--textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
    } catch (err) {
      console.error('Fallback:', err);
      setCopied(false);
    }
  };



  const fillData = ()=> {

    textplace.current.innerHTML  = JSON.stringify( users, null, '\t' );
  };



  const zipit = ()=> {

    const zip = new JSZip();

    let data = textplace.current.innerHTML;

    zip.file("data-sample.txt", data);

    zip.generateAsync({type:"blob"}).then(function(content) {
      saveAs(content, "data-sample.zip");
    });

  };



  const btnTxt = ()=> {

    if(copied){

      return 'Copied';
      
    }
    return 'Copy';

  };



  useEffect(() => {

    dispatch( requestGetUsers({}) );

  }, []); 



  useEffect(() => {

    fillData();    

  },[users]);



  return (
    <section className="extract-view  mb-4 mt-4 m-auto">
      <h4>Copy data to clipboard</h4>
      OR<br></br>
      <h6>
        <button 
          onClick = {(e)=>zipit() }
          className="btn btn-sm btn-outline-primary" 
          >download </button>
          <span className="ms-2 me-2">as txt file</span>
      </h6>
      <div className="mb-3 mt-3 position-relative">
          <button   
            onClick = {(e)=>copyToclipboard() }
            className={ 'copybtn btn btn-sm '+  ((!copied)?' btn-secondary ':'')    +    ((copied)?' btn-success ':'')  }
          >{btnTxt()}
          </button>
          <pre id="highlighting"  aria-hidden="true" className={ (copied)?'copied':'' }>
            <code 
              className="language-html" 
              ref={textplace} 
              id="highlighting-content">
            </code>
          </pre>
      </div>
    </section>
  );
  
}
export default ExtractView;






