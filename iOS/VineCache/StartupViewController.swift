//
//  StartupViewController.swift
//  VineCache
//
//  Created by user28291 on 3/6/15.
//  Copyright (c) 2015 FuzzyGhost. All rights reserved.
//

import UIKit

class StartupViewController: UIViewController, FBLoginViewDelegate {
    
    @IBOutlet var fbLoginView: FBLoginView!
    @IBOutlet var fbProfilePic: FBProfilePictureView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        let baseViewSize: CGRect = self.view.bounds
        self.fbLoginView.center.y = baseViewSize.height - (self.fbLoginView.bounds.height * 2)
        self.fbLoginView.center = self.view.center
        self.fbLoginView.delegate = self
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func loginViewFetchedUserInfo(loginView: FBLoginView!, user: FBGraphUser!) {
        println("User Logged In")
        fbProfilePic.profileID = user.objectID
    }
    
    func loginViewFetchedUserInfo(loginView : FBLoginView!, user: FBGraphUser) {
        println("User: \(user)")
        println("User ID: \(user.objectID)")
        println("User Name: \(user.name)")
        var userEmail = user.objectForKey("email") as String
        println("User Email: \(userEmail)")
    }
    
    func loginViewShowingLoggedOutUser(loginView : FBLoginView!) {
            println("User Logged Out")
    }
    
}

