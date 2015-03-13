//
//  MainGameViewController.swift
//  VineCache
//
//  Created by Admin on 3/11/15.
//  Copyright (c) 2015 FuzzyGhost. All rights reserved.
//

import UIKit
import CoreLocation
import MediaPlayer

class MainGameViewController: UIViewController {

    @IBOutlet var videoPlayer: MPMoviePlayerController!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        /* load a count down view */
        var gamelaunchTimerView:TimerView = TimerView.loadingCountDownTimerViewInView(self.view)
        gamelaunchTimerView.startTimer()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func RecordButtonClick(sender: UIButton) {
        self.performSegueWithIdentifier("segueIdentifier", sender: self)
    }
    
//    func getNextVideo() {
//        self.videoPlayer = MPMoviePlayerController()
//        self.videoPlayer.view.center = self.view.center
//        self.videoPlayer.view.frame = CGRectMake(50, 50, 300, 450)
//        self.videoPlayer.controlStyle = MPMovieControlStyle.Embedded
//        self.videoPlayer.shouldAutoplay = false
//        self.view.addSubview(self.videoPlayer.view)
//    }
}
