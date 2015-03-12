//
//  UploadVideoViewController.swift
//  VineCache
//
//  Created by Admin on 3/10/15.
//  Copyright (c) 2015 FuzzyGhost. All rights reserved.
//

import UIKit
import MobileCoreServices
import MediaPlayer

class UploadVideoViewController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    @IBOutlet var videoController: MPMoviePlayerController!
    var newMedia: Bool?
    var videoURL: NSURL!

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func RecordButtonClick(sender: UIButton) {
        captureVideo()
    }
    
    @IBAction func UploadButtonClick(sender: UIButton) {
        uploadVideo()
    }
    
    func captureVideo() {
        
        println("enetered captureVideo method")
        
        if UIImagePickerController.isSourceTypeAvailable(
            UIImagePickerControllerSourceType.Camera) {
                
                let videoPicker = UIImagePickerController()
                
                videoPicker.delegate = self
                videoPicker.sourceType =
                    UIImagePickerControllerSourceType.Camera
                videoPicker.mediaTypes = [kUTTypeMovie as NSString]
                videoPicker.allowsEditing = false
                
                self.presentViewController(videoPicker, animated: true,
                    completion: nil)
                newMedia = true
        }
    }
    
    func uploadVideo() {
        
    }
    
    func imagePickerController(picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [NSObject : AnyObject]) {
        
        self.videoURL = info[UIImagePickerControllerMediaURL] as NSURL
        self.dismissViewControllerAnimated(true, completion: nil)

        self.videoController = MPMoviePlayerController(contentURL: self.videoURL)
        self.videoController.view.center = self.view.center
        self.videoController.view.frame = CGRectMake(50, 50, 300, 450)
        self.videoController.controlStyle = MPMovieControlStyle.Embedded
        self.view.addSubview(self.videoController.view)
        self.videoController.play()
    }
    
    func imagePickerControllerDidCancel(picker: UIImagePickerController) {
        self.dismissViewControllerAnimated(true, completion: nil)
    }

}
