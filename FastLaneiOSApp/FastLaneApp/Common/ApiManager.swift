//
//  ApiManager.swift
//  FastLaneApp
//
//  Created by Philipp Rieger on 02.11.17.
//  Copyright © 2017 Philipp Rieger. All rights reserved.
//

import Foundation

class ApiManager {
    
    static let sharedInstance = ApiManager()
    
    private var token: String = ""
    private var lastRefreshed: Date? = nil
    private let baseUrl: String = "FILL-ME-IN"      // TODO
    private let username: String = "FILL-ME-IN"     // TODO
    private let password: String = "FILL-ME-IN"     // TODO
    
    // for testing
    private let storeId: String = "59f19dd725680862b129ae18"
    private let productId: String = "59f1988319d3fe5fb8a0b6da"
    
    func getProductByBarcode(barcode: String, completion: @escaping (Product?) -> ()) {
        refreshToken() {
            let urlPath = "products/\(barcode)/?storeId=\(self.storeId)"
            let request = self.setupRequest(httpMethod: "GET", urlPath: urlPath, params: [:])
            self.sendRequest(request: request) { result in
                
                print("[+] Got result from backend when querying for product")
                
                // TODO: description, photo
                if result["name"] != nil && result["price"] != nil {    // TODO: use guards instead
                    let productTitle = result["name"] as! String
                    let productPrice = result["price"] as! Double
                    let product = Product(title: productTitle, description: "Test description", price: productPrice, photo: nil, amount: 0)
                    
                    completion(product!)
                } else {
                    completion(nil)
                }
            }
        }
    }
    
    func getStoreById(storeId: String, completion: @escaping (Store?) -> ()) {
        completion(Store(name: "Test Store"))
        /*
        refreshToken() {
            let urlPath = "stores/\(storeId)"
            let request = self.setupRequest(httpMethod: "GET", urlPath: urlPath, params: [:])
            self.sendRequest(request: request) { result in
                
                print("[+] Got result from backend when querying for store")
                
                // TODO: description, photo
                if result["name"] != nil {    // TODO: use guards instead
                    let storeName = result["name"] as! String
                    let store = Store(name: storeName)
                    completion(store!)
                } else {
                    completion(nil)
                }
            }
        }
        */
    }
    
    func refreshToken(completion: @escaping () -> ()) {
        // check if token needs to be refreshed
        if let lastRefreshed = lastRefreshed {
            let differenceInMinutes = Calendar.current.dateComponents([.minute], from: lastRefreshed, to: Date()).minute ?? 0
            if differenceInMinutes < 60 {
                completion()
                return
            }
        }
        // request new token
        let request = setupRequest(httpMethod: "POST", urlPath: "login", params: ["email": username, "password": password])
        sendRequest(request: request) { result in
            self.token = result["token"] as! String
            self.lastRefreshed = Date()
            print("[+] Refreshed token")
            completion()
        }
    }
    
    
    // MARK: Private Methods
    
    private func setupRequest(httpMethod: String, urlPath: String, params: Dictionary<String, String>) -> URLRequest {
        var request = URLRequest(url: URL(string: baseUrl + urlPath)!)
        request.httpMethod = httpMethod
        if !params.isEmpty {
            request.httpBody = try? JSONSerialization.data(withJSONObject: params, options: [])
        }
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("Bearer ".appending(token), forHTTPHeaderField: "Authorization")
        
        return request
    }
    
    private func sendRequest(request: URLRequest,  completion: @escaping (Dictionary<String, Any>) -> ()) {
        let task = URLSession.shared.dataTask(with: request) { (data: Data?, response: URLResponse?, error: Error?) in
            if let safeData = data {
                do {
                    let jsonData = try JSONSerialization.jsonObject(with: safeData, options: JSONSerialization.ReadingOptions.mutableContainers) as! Dictionary<String, Any>
                    completion(jsonData)
                } catch {
                    print("Error during JSON processing")
                }
            } else {
                print("[-] Error while sending request with error: \(error ?? "" as! Error)")
            }
        }
        task.resume()
    }
}
