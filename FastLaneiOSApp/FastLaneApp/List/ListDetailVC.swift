//
//  ListDetailVC.swift
//  FastLaneApp
//
//  Created by Philipp Rieger on 31.10.17.
//  Copyright © 2017 Philipp Rieger. All rights reserved.
//

import UIKit

class ListDetailVC: UIViewController {
    
    // MARK: Properties
    
    @IBOutlet weak var lblTitle: UILabel!
    @IBOutlet weak var lblPrice: UILabel!
    @IBOutlet weak var lblDescription: UILabel!
    @IBOutlet weak var lblAmount: UILabel!
    @IBOutlet weak var stepperAmount: UIStepper!
    @IBOutlet weak var imgPhoto: UIImageView!
    
    var product: Product?

    @IBAction func stepperAmountValueChanged(_ sender: Any) {
        
        guard let product = product else { return }
        
        let newValue = Int(stepperAmount.value)
        let singlePrice = product.price / Double(product.amount)
        product.price = singlePrice * Double(newValue)
        lblPrice.text = "Price: $ " + String(product.price)
        product.amount = newValue
        lblAmount.text = "Amount: " + String(newValue)
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        if let product = product {
            lblTitle.text = product.title
            lblDescription.text = product.description
            lblPrice.text = "Price: $ " + String(product.price)
            lblAmount.text = "Amount: " + String(product.amount)
            imgPhoto.image = product.photo
            
            stepperAmount.wraps = true
            stepperAmount.autorepeat = true
            stepperAmount.maximumValue = 30
            stepperAmount.value = Double(product.amount)
        }
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
