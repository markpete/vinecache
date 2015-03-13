using Facebook;
using Facebook.Client;
using Parse;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.ApplicationModel;
using Windows.ApplicationModel.Activation;
using Windows.Devices.Geolocation;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.Storage.Streams;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Animation;
using Windows.UI.Xaml.Navigation;

// The Blank Application template is documented at http://go.microsoft.com/fwlink/?LinkId=391641

namespace VineCache
{
    /// <summary>
    /// Provides application-specific behavior to supplement the default Application class.
    /// </summary>
    public sealed partial class App : Application
    {
        private TransitionCollection transitions;
        private static Geolocator s_GPS;
		public static ParseDB parseDB;
		public static string facebookToken;
		public static string facebookName;
		public static string facebookID;
		public static string facebookEmail;
		public static int currentNodeNumba = 0;

		/// <summary>
		/// Initializes the singleton application object.  This is the first line of authored code
		/// executed, and as such is the logical equivalent of main() or WinMain().
		/// </summary>
		public App()
        {
            this.InitializeComponent();
            this.Suspending += this.OnSuspending;
            ParseClient.Initialize("ODbBwcIu8uZ4zuJ8PGsinEtXeyUswCXL9pUnddov", "0xnE8Q36PWvW517XvQlCEyBmKS0etT5VEdP5gyaP");
			parseDB = new ParseDB();
		}

        /// <summary>
        /// Invoked when the application is launched normally by the end user.  Other entry points
        /// will be used when the application is launched to open a specific file, to display
        /// search results, and so forth.
        /// </summary>
        /// <param name="e">Details about the launch request and process.</param>
        protected override void OnLaunched(LaunchActivatedEventArgs e)
        {
#if DEBUG
            if (System.Diagnostics.Debugger.IsAttached)
            {
                this.DebugSettings.EnableFrameRateCounter = true;
            }
#endif

            Frame rootFrame = Window.Current.Content as Frame;

            // Do not repeat app initialization when the Window already has content,
            // just ensure that the window is active
            if (rootFrame == null)
            {
                // Create a Frame to act as the navigation context and navigate to the first page
                rootFrame = new Frame();

                // TODO: change this value to a cache size that is appropriate for your application
                rootFrame.CacheSize = 1;

                // Set the default language
                rootFrame.Language = Windows.Globalization.ApplicationLanguages.Languages[0];

                if (e.PreviousExecutionState == ApplicationExecutionState.Terminated)
                {
                    // TODO: Load state from previously suspended application
                }

                // Place the frame in the current Window
                Window.Current.Content = rootFrame;
            }

            if (rootFrame.Content == null)
            {
                // Removes the turnstile navigation for startup.
                if (rootFrame.ContentTransitions != null)
                {
                    this.transitions = new TransitionCollection();
                    foreach (var c in rootFrame.ContentTransitions)
                    {
                        this.transitions.Add(c);
                    }
                }

                rootFrame.ContentTransitions = null;
                rootFrame.Navigated += this.RootFrame_FirstNavigated;

                // When the navigation stack isn't restored navigate to the first page,
                // configuring the new page by passing required information as a navigation
                // parameter
                if (!rootFrame.Navigate(typeof(MainPage), e.Arguments))
                {
                    throw new Exception("Failed to create initial page");
                }
            }

            // Ensure the current window is active
            Window.Current.Activate();

            //ParseAnalytics.TrackAppOpenedAsync();
        }

        /// <summary>
        /// Restores the content transitions after the app has launched.
        /// </summary>
        /// <param name="sender">The object where the handler is attached.</param>
        /// <param name="e">Details about the navigation event.</param>
        private void RootFrame_FirstNavigated(object sender, NavigationEventArgs e)
        {
            var rootFrame = sender as Frame;
            rootFrame.ContentTransitions = this.transitions ?? new TransitionCollection() { new NavigationThemeTransition() };
            rootFrame.Navigated -= this.RootFrame_FirstNavigated;
        }

        /// <summary>
        /// Invoked when application execution is being suspended.  Application state is saved
        /// without knowing whether the application will be terminated or resumed with the contents
        /// of memory still intact.
        /// </summary>
        /// <param name="sender">The source of the suspend request.</param>
        /// <param name="e">Details about the suspend request.</param>
        private void OnSuspending(object sender, SuspendingEventArgs e)
        {
            var deferral = e.SuspendingOperation.GetDeferral();

            // TODO: Save application state and stop any background activity
            deferral.Complete();
        }

        /// <summary>
        /// Invoked when application is activated.
        /// </summary>
        /// <param name="args"></param>
        protected override void OnActivated(IActivatedEventArgs args)
        {
            base.OnActivated(args);

            //We want to be notified when the facebook authentication has completed
            Session.OnFacebookAuthenticationFinished += OnFacebookAuthenticationFinished;
            var protocolArgs = args as ProtocolActivatedEventArgs;
            LifecycleHelper.FacebookAuthenticationReceived(protocolArgs);
        }

        /// <summary>
        /// This 
        /// </summary>
        /// <param name="session"></param>
        private void OnFacebookAuthenticationFinished(AccessTokenData session)
        {
            Frame rootFrame = Window.Current.Content as Frame;
            rootFrame.Navigate(typeof(DisplayVideoPage));
			facebookToken = session.AccessToken;
			facebookID = session.FacebookId;

			parseDB.parseDelegate = new VineCacheParseDelegate();
			parseDB.GetNextAvailableEvent();
		}

		internal class VineCacheParseDelegate : ParseDelegate
		{
			bool eventReturned = false;
			public void EventResult(PLEvent eventItem)
			{
				if (eventReturned)
				{
					FacebookClient client = new FacebookClient(facebookToken);
					client.GetTaskAsync("me", new { fields = "name, id, email" }).ContinueWith((Task<object> task, object item) =>
					{
						dynamic facebookInfo = task.Result;
						App.facebookName = facebookInfo.name;
						App.facebookID = facebookInfo.id;
						//App.facebookEmail = facebookInfo.email;
						parseDB.CreatePlayer(App.facebookName, App.facebookEmail, App.facebookID, item as PLEvent);
						parseDB.GetMap(item as PLEvent);
					}, eventItem);
				}
				eventReturned = true;
			}

			public void MapResult(PLMap mapItem)
			{
				parseDB.GetNodes(mapItem);
			}

			public void NodeResult(List<PLNode> nodeList)
			{
				parseDB.RetrieveVideo(nodeList[currentNodeNumba]);
			}

			public async void VideoRetrieved(PLNode node)
			{
				InMemoryRandomAccessStream s = new InMemoryRandomAccessStream();
				StorageFolder folder = KnownFolders.VideosLibrary;
				StorageFile file = await folder.CreateFileAsync("vinecachetargetvideo.mp4", CreationCollisionOption.ReplaceExisting);
				await FileIO.WriteBytesAsync(file, node.Video as byte[]);
			}
		}


		internal static Geolocator GPS
        {
            get
            {
                if (s_GPS == null)
                {
                    s_GPS = new Geolocator();
                    s_GPS.DesiredAccuracy = PositionAccuracy.High;
                    s_GPS.MovementThreshold = 10;
                }
                return s_GPS;
            }
        }
    }
}