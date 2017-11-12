//
//  Product.swift
//  FastLaneApp
//
//  Created by Philipp Rieger on 31.10.17.
//  Copyright © 2017 Philipp Rieger. All rights reserved.
//

import UIKit

class Product {
    
    // MARK: Properties
    var title: String
    var description: String
    var price: Double
    var photo: UIImage?
    var amount: Int
    
    // MARK: Initialization
    init?(title: String, description: String, price: Double, photo: UIImage?, amount: Int) {
        
        // title may not be empty
        guard !title.isEmpty else {
            return nil
        }
        
        // description may not be empty
        guard !description.isEmpty else {
            return nil
        }
        
        // price may not be negative
        guard price >= 0 else {
            return nil
        }
        
        guard amount >= 0 else {
            return nil
        }
        
        // initialize stored properties
        self.title = title
        self.description = description
        self.price = price
        self.photo = photo
        self.amount = amount
    }
}
