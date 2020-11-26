import React, { useState } from 'react';
import './App.css';

const App = () => {
    const [productId, setProduct] = useState('');
    const [vendorId, setVendor] = useState('');

    const handleClick = async () =>{
        let device; 
        /* Get the vendor and product ID */
        var VENDOR_ID = parseInt(vendorId, 16);
        var PRODUCT_ID = parseInt(productId, 16);
        console.log(VENDOR_ID + " " + PRODUCT_ID); // Testing if we get correctly the device's data
        try {
            /*The first time the user has visited the page then it won’t have permission 
            to access any devices. Therefore, in order to use USB device, you need to 
            request a permission from the user by calling requestDevice() method*/
            device = await navigator.usb.requestDevice({
                filters: [{
                vendorId: VENDOR_ID,
                productId: PRODUCT_ID
                }]
            });
            console.log('openning...'); // Testing for open devices
            // await device.open();
            // console.log('opened:', device); // Testing for open devices
            // if (device.configuration === null)
            //     await device.selectConfiguration(1);
            // await device.claimInterface(1);
            device.open()
            .then( () => {
              console.log("into open device");
              device.selectConfiguration(1);  // Select configuration #1 for the device.
            }) 
            .then(() => device.claimInterface(1)) // Request exclusive control over interface #2.
            .then(() => device.controlTransferOut({
                requestType: 'vendor',
                recipient: 'interface',
                request: 0x22,
                value: 0x01,
                index: 0x01 // Ready to receive data at interface 1
              })) 
            .then(() => device.transferIn(5, 64)) // Waiting for 64 bytes of data from endpoint #5.
            .then(result => {
              const decoder = new TextDecoder();
              console.log('Received: ' + decoder.decode(result.data));
            })
            .catch(error => { console.error(error); });
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="main-container">
            <input type="text" className="search" placeholder="Product ID" value={productId} onChange={(e) => setProduct(e.target.value)} required/>
            <input type="text" className="search" placeholder="Vendor ID" value={vendorId} onChange={(e) => setVendor(e.target.value)} required/>
            <button onClick={handleClick}>
                Connect
            </button>
        </div>
    );
}

export default App;