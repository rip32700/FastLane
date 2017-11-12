//
//  Store.swift
//  FastLaneApp
//
//  Created by Philipp Rieger on 08.11.17.
//  Copyright © 2017 Philipp Rieger. All rights reserved.
//

import Foundation

class Store {
    
    // MARK: Properties
    var name: String
    
    // MARK: Initialization
    init?(name: String) {
        
        // name may not be empty
        guard !name.isEmpty else {
            return nil
        }
        
        // initialize stored properties
        self.name = name
    }
}
