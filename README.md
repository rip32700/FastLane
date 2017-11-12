# :gift: FastLane :gift: #

## Introduction

The purpose of the app is to eliminate long check out times at stores. The idea is that every customer scans barcodes of products he purchases himself and can pay with a single button click in the end. Furthermore, the store can obtain information about how many customers are in the store and which products are being bought with an analytics app.

## Flow

* The customer enters a store and scans a barcode that is associated with the store. Thereby, the connection to that specific store is established.
* Then, barcodes of products can be stored and thereby added to the shopping cart.
* When the customer is ready, he can pay all his articles with the app.
* After paying, a QR code is generated that could be used to exit through some sort of exit gate that scans barcodes and checks the payment status.

## Details

* The payments are managed by a backend, enabling also a history.
* Product information can be obtained by routing requests from the backend to specific store APIs, that can be plugged into the backend.

