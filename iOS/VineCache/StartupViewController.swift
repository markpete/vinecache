//
//  StartupViewController.swift
//  VineCache
//
//  Created by user28291 on 3/6/15.
//  Copyright (c) 2015 FuzzyGhost. All rights reserved.
//

import UIKit

class StartupViewController: UIViewController, FBLoginViewDelegate, ParseDelegate{
    
    @IBOutlet var fbLoginView: FBLoginView!
    //@IBOutlet var fbProfilePic: FBProfilePictureView!
    var fbUser: FBGraphUser!
    
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
    
    func loginViewFetchedUserInfo(loginView : FBLoginView!, user: FBGraphUser) {
        println("User Logged In")
        //fbProfilePic.profileID = user.objectID
        
        println("User: \(user)")
        println("User ID: \(user.objectID)")
        println("User Name: \(user.name)")
        //var userEmail = user.objectForKey("email") as String
        //println("User Email: \(userEmail)")
        
        fbUser = user
        
//        //Initialize Game
//        _ParseDB = ParseDB()
//        _ParseDB!.delegate = self
//        _ParseDB?.GetNextAvailableEvent()
//        _ParseDB?.GetNodes(_PLMap!)
        //_PLPlayer!.CurrentNode = _PLNodes!.first!
        
        //Navigate to main page
        self.performSegueWithIdentifier("segueIdentifier", sender: self)
        
        //let DisplayVideoViewController = self.storyboard?.instantiateViewControllerWithIdentifier("DisplayVideoViewController") as SecondViewController
        //self.navigationController?.pushViewController(DisplayVideoViewController, animated: true)
    }

    
    func loginViewShowingLoggedOutUser(loginView : FBLoginView!) {
        println("User Logged Out")
    }
    
    
    func EventResult(eventItem:PLEvent){
        _ParseDB?.CreatePlayer(fbUser.name, FacebookId: fbUser.objectID, event: _PLEvent!)
    }
    func MapResult(mapItem: PLMap){
        _ParseDB?.GetNodes(_PLMap!)
    }
    func NodesResult(nodeList: [PLNode]){
        //picking the current node and saving all nodes
        //setup visited (empty at the beginning)
        //_PLPlayer!.CurrentNode = _PLNodes!.first!
        
        //Navigate to main page
        self.performSegueWithIdentifier("segueIdentifier", sender: self)
    }
    func VideoRetrieved(node: PLNode){
        
    }
    
}

