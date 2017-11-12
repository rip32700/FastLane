//
//  ListCell.swift
//  FastLaneApp
//
//  Created by Philipp Rieger on 06.11.17.
//  Copyright © 2017 Philipp Rieger. All rights reserved.
//

import UIKit

class ListCell: UITableViewCell {

    // MARK: Properties
    
    @IBOutlet weak var lblTitle: UILabel!
    @IBOutlet weak var lblAmount: UILabel!
    @IBOutlet weak var lblPrice: UILabel!
    @IBOutlet weak var imgPhoto: UIImageView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
    
}
