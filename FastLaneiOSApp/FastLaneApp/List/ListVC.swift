//
//  ListVC.swift
//  FastLaneApp
//
//  Created by Philipp Rieger on 06.11.17.
//  Copyright © 2017 Philipp Rieger. All rights reserved.
//

import UIKit

class ListVC: UIViewController, UITableViewDelegate, UITableViewDataSource {

    // MARK: Properties
    @IBOutlet weak var tableView: UITableView!
    var products = [Product]()
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // configure table view
        tableView.delegate = self
        tableView.dataSource = self
        
        createNewSessionInBackend()
        // for testing, load sample data
        // TODO: remove later
        loadSampleProducts()
        
        // Use the edit button item provided by the table view controller.
        navigationItem.leftBarButtonItem = editButtonItem
        
        // allow edigint
        self.tableView.allowsSelectionDuringEditing = true
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillAppear(_ animated: Bool) {
        self.tableView.contentInset = UIEdgeInsets(top: 10, left: 0, bottom: 0, right: 0)
        self.tableView.reloadData()
    }
    
    ///////////////////////////////////////////////////////
    // MARK: Private Functions
    ///////////////////////////////////////////////////////
    
    private func loadSampleProducts() {
        let photo1 = UIImage(named: "sample1")
        let photo2 = UIImage(named: "sample2")
        
        guard let product1 = Product(title: "Strawberry Yoghurt", description: "A delicious yoghurt with fruity strawberries. Perfectly served cold on hot summer days.", price: 4.80, photo: photo1, amount: 1) else {
            fatalError("Could not init sample product 1")
        }
        guard let product2 = Product(title: "Rittersport Chocolate", description: "Choclate that will hit your spot right away.", price: 1.99, photo: photo2, amount: 1) else {
            fatalError("Could not init sample product 2")
        }
        
        products += [product1, product2]
    }
    
    private func createNewSessionInBackend() {
        print("[+] Creating new session in backend")
        
        // TODO
    }
    
    ///////////////////////////////////////////////////////
    // MARK: Table View Data Source
    ///////////////////////////////////////////////////////
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return products.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cellIdentifier = "ListCell"
        guard let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier, for: indexPath) as? ListCell  else {
            fatalError("The dequeued cell is not an instance of ListTableViewCell.")
        }
        
        // Fetches the appropriate meal for the data source layout.
        let product = products[indexPath.row]
        
        // And configure the cell
        cell.lblTitle.text = product.title
        cell.lblPrice.text = "Price: $ " + String(product.price)
        cell.lblAmount.text = "Amount: " + String(product.amount)
        if let photo = product.photo {
            cell.imgPhoto.image = photo
        }
        
        
        return cell
    }
    
    // Override to support editing the table view.
    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            products.remove(at: indexPath.row)
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }
    }
    
    // Override to support conditional editing of the table view.
    func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    
    override func setEditing(_ editing: Bool, animated: Bool) {
        let status = navigationItem.leftBarButtonItem?.title
        if status == "Edit" {
            tableView.isEditing = true
            navigationItem.leftBarButtonItem?.title = "Done"
        }
        else {
            tableView.isEditing = false
            navigationItem.leftBarButtonItem?.title = "Edit"
        }
    }

    ///////////////////////////////////////////////////////
    // MARK: - Navigation
    ///////////////////////////////////////////////////////
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        super.prepare(for: segue, sender: sender)
        
        if let identifier = segue.identifier {
            switch identifier {
            case "showDetail":
                guard let listDetailVC = segue.destination as? ListDetailVC else {
                    fatalError("Unexpected destination: \(segue.destination)")
                }
                guard let selectedProductCell = sender as? ListCell else {
                    fatalError("Unexpected sender: \(String(describing: sender))")
                }
                guard let indexPath = tableView.indexPath(for: selectedProductCell) else {
                    fatalError("The selected cell is not being displayed by the table")
                }
                let selectedProduct = products[indexPath.row]
                listDetailVC.product = selectedProduct
            case "showProductScan":
                guard let scannerVC = segue.destination as? ScannerVC else {
                    fatalError("Unexpected destination: \(segue.destination)")
                }
                scannerVC.action = "scanProducts"
            case "showPayment":
                print("Transitioning to payment")
            default:
                fatalError("Unexpected segue: \(String(describing: segue.identifier))")
            }
            
        }
    }

}
