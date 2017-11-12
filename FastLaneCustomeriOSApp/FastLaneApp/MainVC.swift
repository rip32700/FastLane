//
//  ViewController.swift
//  FastLaneApp
//
//  Created by Philipp Rieger on 27.10.17.
//  Copyright © 2017 Philipp Rieger. All rights reserved.
//

import UIKit
import AlertOnboarding
import PopupDialog

class MainVC: UIViewController {

    // MARK: Properties
    
    let activatedColor: UIColor = UIColor(red: 190/255, green: 154/255, blue: 113/255, alpha: 1.0)
    let deactivatedColor: UIColor = UIColor(red: 215/255, green: 193/255, blue: 168/255, alpha: 1.0)
    
    @IBOutlet weak var btnList: UIButton!
    var store: Store?
    
    @IBAction func btnInfo(_ sender: Any) {
        print("info clicked")
        
        //First, declare datas
        let arrayOfImage = ["qrcode", "list-icon", "barcode", "paying-icon", "qrcode"]
        let arrayOfTitle = ["Scan Shop QR Code", "Your Shopping List", "Scan Product Barcodes", "Pay On Mobile", "Scan QR Code On Exit"]
        let arrayOfDescription = ["First, scan the QR Code located at the entrance of the store.",
                                  "Switch to the List View that should now be accessible showing all your items.",
                                  "Switch to the Scanner and scan barcodes of the products you want to purchase.",
                                  "Click the PAY button and choose your payment method.",
                                  "After the payment succeeded, a QR code is generated. Scan it at the exit of the store to open the exit gates."]
        
        //Simply call AlertOnboarding...
        let alertView = AlertOnboarding(arrayOfImage: arrayOfImage, arrayOfTitle: arrayOfTitle, arrayOfDescription: arrayOfDescription)
        
        //Modify background color of AlertOnboarding
        // alertView.colorForAlertViewBackground = UIColor(red: 173/255, green: 206/255, blue: 183/255, alpha: 1.0)
        
        //Modify colors of AlertOnboarding's button
        alertView.colorButtonText = UIColor.black
        alertView.colorButtonBottomBackground = activatedColor
        
        //... and show it !
        alertView.show()
 
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // on startup disable list button
        btnList.isEnabled = false
        btnList.backgroundColor = deactivatedColor
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        super.prepare(for: segue, sender: sender)
        
        if let identifier = segue.identifier {
            switch identifier {
            case "showShopScan":
                guard let scannerVC = segue.destination as? ScannerVC else {
                    fatalError("Unexpected destination: \(segue.destination))")
                }
                scannerVC.action = "scanShop"
            default:
                return
            }
        }
    }
    
    @IBAction func unwindToMainFromScanner(segue: UIStoryboardSegue) {
        guard let scannerVC = segue.source as? ScannerVC else { return }
        store = scannerVC.store
        
        // enable list button
        btnList.isEnabled = true
        btnList.backgroundColor = activatedColor
    }
}

