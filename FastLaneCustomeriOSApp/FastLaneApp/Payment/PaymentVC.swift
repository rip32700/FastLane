//
//  PaymentVC.swift
//  FastLaneApp
//
//  Created by Philipp Rieger on 06.11.17.
//  Copyright © 2017 Philipp Rieger. All rights reserved.
//

import UIKit

class PaymentVC: UIViewController {

    // MARK: Properties
    
    @IBOutlet weak var imgQRCode: UIImageView!
    
    let qrCodeString = "12345"
    var qrCodeImage: CIImage!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // generate the QR code
        let data = qrCodeString.data(using: String.Encoding.isoLatin1, allowLossyConversion: false)
        let filter = CIFilter(name: "CIQRCodeGenerator")
        filter?.setValue(data, forKey: "inputMessage")
        filter?.setValue("Q", forKey: "inputCorrectionLevel")
        
        qrCodeImage = filter!.outputImage
        // scale
        let scaleX = imgQRCode.frame.size.width / qrCodeImage.extent.size.width
        let scaleY = imgQRCode.frame.size.height / qrCodeImage.extent.size.height
        let transformedImage = qrCodeImage.transformed(by: CGAffineTransform(scaleX: scaleX, y: scaleY))
        
        // transform CIImage to UIImage
        let context:CIContext = CIContext.init(options: nil)
        let cgImage:CGImage = context.createCGImage(transformedImage, from: transformedImage.extent)!
        imgQRCode.image = UIImage.init(cgImage: cgImage)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
