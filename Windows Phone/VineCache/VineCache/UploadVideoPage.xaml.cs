using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Media.Capture;
using Windows.Media.MediaProperties;
using Windows.Phone.UI.Input;
using Windows.Storage;
using Windows.Storage.Streams;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkID=390556

namespace VineCache
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class UploadVideoPage : Page
    {
        private MediaCapture mediaCapture;
        private const string VideoFileName = "vinecache.mp4";

        public UploadVideoPage()
        {
            this.InitializeComponent();
        }

        private async void InitVideoCapture()
        {
            this.mediaCapture = new MediaCapture();
            await this.mediaCapture.InitializeAsync();
            this.mediaCapture.SetPreviewRotation(VideoRotation.Clockwise90Degrees);
            this.mediaCapture.SetRecordRotation(VideoRotation.Clockwise90Degrees);
            this.videoPreviewElement.Source = mediaCapture;
            await this.mediaCapture.StartPreviewAsync();
        }

        private async void StartRecordingVideo()
        {
            if (this.mediaCapture != null)
            {
                StorageFile videoStorageFile = await KnownFolders.VideosLibrary.CreateFileAsync(VideoFileName, CreationCollisionOption.ReplaceExisting);
                MediaEncodingProfile encodingProfile = MediaEncodingProfile.CreateMp4(VideoEncodingQuality.HD720p);
                await this.mediaCapture.StartRecordToStorageFileAsync(encodingProfile, videoStorageFile);

                await Task.Delay(6000);
                StopRecordingVideo();
            }
        }

        private async void StopRecordingVideo()
        {
            await this.mediaCapture.StopRecordAsync();
        }

        private void UploadRecordedVideo()
        {
            App.parseDB.parseDelegate = new UploadVideoParseDelegate();
            App.parseDB.GetNextAvailableEvent();
        }

        internal class UploadVideoParseDelegate : ParseDelegate
        {
            public void EventResult(PLEvent eventItem)
            {
                App.parseDB.GetMap(eventItem);
            }

            public void MapResult(PLMap mapItem)
            {
                App.parseDB.GetNodes(mapItem);
            }

            public async void NodeResult(List<PLNode> nodeList)
            {
                StorageFile videoStorageFile = await KnownFolders.VideosLibrary.GetFileAsync(VideoFileName);
                if (videoStorageFile != null)
                {
                    byte[] videoData = await ReadFile(videoStorageFile);
                    App.parseDB.UploadVideo(videoData, nodeList[App.currentNodeNumba]);
                }
            }

            public void VideoRetrieved(PLNode node)
            {
            }
        }


        /// <summary>
        /// Loads the byte data from a StorageFile
        /// </summary>
        /// <param name="file">The file to read</param>
        private static async Task<byte[]> ReadFile(StorageFile file)
        {
            byte[] fileBytes = null;
            using (IRandomAccessStreamWithContentType stream = await file.OpenReadAsync())
            {
                fileBytes = new byte[stream.Size];
                using (DataReader reader = new DataReader(stream))
                {
                    await reader.LoadAsync((uint)stream.Size);
                    reader.ReadBytes(fileBytes);
                }
            }
            return fileBytes;
        }

        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.
        /// This parameter is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            this.InitVideoCapture();
        }

        private void StartRecordingButton_Click(object sender, RoutedEventArgs e)
        {
            StartRecordingVideo();
        }

        private void UploadRecordingButton_Click(object sender, RoutedEventArgs e)
        {
            UploadRecordedVideo();
        }


        private void videoMediaElement_Tapped(object sender, RoutedEventArgs e)
        {

        }
    }
}
