//
//  MainGameViewController.swift
//  VineCache
//
//  Created by Admin on 3/11/15.
//  Copyright (c) 2015 FuzzyGhost. All rights reserved.
//

import UIKit
import CoreLocation

class MainGameViewController: UIViewController, CLLocationManagerDelegate {
    
    @IBOutlet var proximityBar:UIProgressView!
    
    var locationManager:CLLocationManager!
    var currentLocation:CLLocation!
    var destination:CLLocation!
    var distanceInitialToDestination:CLLocationDistance!

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        locationManager = CLLocationManager()
            locationManager.delegate = self
            locationManager.distanceFilter = 10
            locationManager.desiredAccuracy = 10
            locationManager.requestAlwaysAuthorization()
            locationManager.startUpdatingLocation()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
        
    }
    

    @IBAction func RecordButtonClick(sender: UIButton) {
        self.performSegueWithIdentifier("segueIdentifier", sender: self)
    }
    
    
    func locationManager(manager: CLLocationManager!, didUpdateLocations locations: [AnyObject]!) {
        let location = locations.last as CLLocation
        currentLocation = location
        newDestination()
        updateProgress()
    }
    
    func newDestination(destination:CLLocation? = nil) {
        if destination != nil {
            self.destination = destination
        }
        if self.destination != nil && currentLocation != nil {
            distanceInitialToDestination = currentLocation.distanceFromLocation(self.destination)
        }
    }
    
    func updateProgress() {
        if destination == nil {
            return
        }
        let distance = currentLocation.distanceFromLocation(destination)
        var ratio:Float = (Float)(distance as Double / distanceInitialToDestination as Double)
        ratio /= 2
        proximityBar.setProgress(ratio, animated: true)
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
