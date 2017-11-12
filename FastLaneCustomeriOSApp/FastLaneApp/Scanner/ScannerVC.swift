//
//  QRScanViewController.swift
//  FastLaneApp
//
//  Created by Philipp Rieger on 29.10.17.
//  Copyright © 2017 Philipp Rieger. All rights reserved.
//

import UIKit
import AVFoundation

class ScannerVC: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    
    // MARK: Properties
    
    // UI properties
    @IBOutlet weak var lblMessage: UILabel!
    var captureDevice:AVCaptureDevice?
    var videoPreviewLayer:AVCaptureVideoPreviewLayer?
    let codeFrame:UIView = {
        let codeFrame = UIView()
        codeFrame.layer.borderColor = UIColor.green.cgColor
        codeFrame.layer.borderWidth = 2
        codeFrame.frame = CGRect.zero
        codeFrame.translatesAutoresizingMaskIntoConstraints = false
        return codeFrame
    }()
    var captureSession: AVCaptureSession = AVCaptureSession()
    
    // logic properties
    var products = [Product]()
    var action: String = ""
    var stringCodeValue: String = ""
    var store: Store?

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // adjust UI elements
        setDefaultLabels()
        view.backgroundColor = .white
        
        // setup the scanner capturing
        setupCapturer()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        if self.isMovingFromParentViewController {
            // going back to the list view - adding the
            // products whose barcode was read
            if let listVC = self.navigationController?.viewControllers.first as? ListVC {
                listVC.products += products
            }
        }
    }
    
    // MARK: Capture Result Function
    
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        
        // No barcode was recognized
        if metadataObjects.count == 0 {
            codeFrame.frame = CGRect.zero
            setDefaultLabels()
            return
        }
        
        // extract the found string value
        let metadataObject = metadataObjects[0] as! AVMetadataMachineReadableCodeObject
        stringCodeValue = metadataObject.stringValue!
        
        // add the detection frame to the UI
        view.addSubview(codeFrame)
        guard let barcodeObject = videoPreviewLayer?.transformedMetadataObject(for: metadataObject) else { return }
        codeFrame.frame = barcodeObject.bounds
        
        // set the labels
        if action == "scanShop" {
            lblMessage.text = "Shop QR Code detected"
        } else if action == "scanProducts" {
            lblMessage.text = "Product Barcode detected"
        }
        
        // stop the capture session from running, and get product/store
        // for the detected code from the backend and take appropriate actions
        captureSession.stopRunning()
        fetchObjectFromBackend()
    }
    
    // MARK: Private functions
    
    private func showConfirmationDialogForProduct(product: Product) {
        let actionSheetController: UIAlertController = UIAlertController(title: "Product: " + product.title, message: "Do you want to add this item?", preferredStyle: .alert)
        
        // add amount text input
        actionSheetController.addTextField { (textField) in
            textField.placeholder = "Enter Amount"
        }
        
        // cancel button
        let cancelAction: UIAlertAction = UIAlertAction(title: "NO", style: .cancel) { action -> Void in
            self.restartCapturing()
        }
        actionSheetController.addAction(cancelAction)
        
        // confirm button
        let okAction = UIAlertAction(title: "YES", style: UIAlertActionStyle.default) { result -> Void in
            let amount = actionSheetController.textFields?[0].text
            product.amount += Int(amount!)!
            self.products.append(product)
            self.restartCapturing()
        }
        actionSheetController.addAction(okAction)
        self.present(actionSheetController, animated: true, completion: nil)
    }
    
    private func showConfirmationDialogForStore(store: Store) {
        let actionSheetController: UIAlertController = UIAlertController(title: "Info", message: "Store \(store.name) was recognized.", preferredStyle: .alert)
        
        // confirm button
        let okAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.default) { result -> Void in
            self.store = store
            self.performSegue(withIdentifier: "unwindToMainFromScanner", sender: self)
        }
        actionSheetController.addAction(okAction)
        self.present(actionSheetController, animated: true, completion: nil)
    }
    
    private func showWarningDialogForProduct() {
        let actionSheetController: UIAlertController = UIAlertController(title: "Warning", message: "No product found for this Barcode.", preferredStyle: .alert)
        let okAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.default) { result -> Void in
            self.restartCapturing()
        }
        actionSheetController.addAction(okAction)
        self.present(actionSheetController, animated: true, completion: nil)
    }
    
    private func showWarningDialogForStore() {
        let actionSheetController: UIAlertController = UIAlertController(title: "Warning", message: "No store found for this QR Code.", preferredStyle: .alert)
        let okAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.default) { result -> Void in
            self.restartCapturing()
        }
        actionSheetController.addAction(okAction)
        self.present(actionSheetController, animated: true, completion: nil)
    }
    
    private func restartCapturing() {
        captureSession.startRunning()
        setDefaultLabels()
        codeFrame.frame = CGRect.zero
    }
    
    private func setupCapturer() {
        captureDevice = AVCaptureDevice.default(for: .video)
        // Check if captureDevice returns a value and unwrap it
        if let captureDevice = captureDevice {
            
            do {
                let input = try AVCaptureDeviceInput(device: captureDevice)
                
                captureSession.addInput(input)
                let captureMetadataOutput = AVCaptureMetadataOutput()
                captureSession.addOutput(captureMetadataOutput)
                
                captureMetadataOutput.setMetadataObjectsDelegate(self, queue: .main)
                captureMetadataOutput.metadataObjectTypes = [.code128, .qr, .ean13,  .ean8, .code39] //AVMetadataObject.ObjectType
                //captureMetadataOutput.metadataObjectTypes = [.qr] //AVMetadataObject.ObjectType
                
                captureSession.startRunning()
                
                videoPreviewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
                videoPreviewLayer?.videoGravity = .resizeAspectFill
                videoPreviewLayer?.frame = view.layer.bounds
                view.layer.addSublayer(videoPreviewLayer!)
                
                // Move the labels to the front
                view.bringSubview(toFront: lblMessage)
                
            } catch {
                print("Error Device Input")
            }
        }
    }
    
    private func setDefaultLabels() {
        switch action {
        case "scanShop":
            navigationItem.title = "Scan Shop QR Code"
            lblMessage.text = "No QR Code detected"
        case "scanProducts":
            navigationItem.title = "Scan Product Barcodes"
            lblMessage.text = "No Barcode detected"
        default:
            // nothing to do here
            break
        }
    }
    
    private func fetchObjectFromBackend() {
        switch action {
        case "scanShop":
            ApiManager.sharedInstance.getStoreById(storeId: stringCodeValue) { store in
                print("[+] Got Store object from backend")
                DispatchQueue.main.async(){
                    // updating UI, so do in main thread
                    if let store = store {
                        self.showConfirmationDialogForStore(store: store)
                    } else {
                        self.showWarningDialogForStore()
                    }
                }
            }
        case "scanProducts":
            ApiManager.sharedInstance.getProductByBarcode(barcode: stringCodeValue) { product in
                print("[+] Got Product object from backend")
                DispatchQueue.main.async(){
                    // updating UI, so do in main thread
                    if let product = product {
                        self.showConfirmationDialogForProduct(product: product)
                    } else {
                        self.showWarningDialogForProduct()
                    }
                }
            }
        default:
            break
        }
        
        
        
    }
    
}

