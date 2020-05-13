// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Empties the grid of images.
function clearPreview() {
    showPreview(null, null);
  }

  var albumList  = [];

  function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}
function showAlbums(albums){

  console.log("Loaded albums: " + albums);
  // Render each album from the backend in its own row, consisting of
  // title, cover image, number of items, link to Google Photos and a
  // button to add it to the photo frame.
  // The items rendered here are albums that are returned from the
  // Library API.
  $.each(albums, (i, item) => {
    // Load the cover photo as a 100x100px thumbnail.
    // It is a base url, so the height and width parameter must be appened.
    const thumbnailUrl = `${item.coverPhotoBaseUrl}=w100-h100`;

    // Set up a Material Design Lite list.
    const materialDesignLiteList =
        $('<li />').addClass('mdl-list__item mdl-list__item--two-line');

    // Create the primary content for this list item.
    const primaryContentRoot =
        $('<div />').addClass('mdl-list__item-primary-content');
    materialDesignLiteList.append(primaryContentRoot);

    // The image showing the album thumbnail.
    const primaryContentImage = $('<img />')
                                    .attr('src', thumbnailUrl)
                                    .attr('alt', item.title)
                                    .addClass('mdl-list__item-avatar');
    primaryContentRoot.append(primaryContentImage);

    // The title of the album as the primary title of this item.
    const primaryContentTitle = $('<div />').text(item.title)
                                            .addClass('textTitle');
    primaryContentRoot.append(primaryContentTitle);

    // The number of items in this album as the sub title.
    const primaryContentSubTitle =
        $('<div />')
            .text(`(${item.mediaItemsCount} items)`)
            .addClass('textSubtitle');
    primaryContentRoot.append(primaryContentSubTitle);

    // Secondary content consists of two links with buttons.
    const secondaryContentRoot =
        $('<div />').addClass('mdl-list__item-secondary-action');
    materialDesignLiteList.append(secondaryContentRoot);


    // The 'add to photo frame' link.
    const linkToAddToPhotoFrame = $('<a />')
                                      .on('click', function() { displayImage(item.id);})
                                      .addClass('album-title')
                                      .attr('data-id', item.id)
                                      .attr('data-title', item.title);
    secondaryContentRoot.append(linkToAddToPhotoFrame);


    // The button for the 'add to photo frame' link.
    const addToPhotoFrameButton =
        $('<button />')
            .addClass(
                'mdl-button mdl-js-button mdl-button--raised mdl-button--accent')
            .text('View Photos');
    linkToAddToPhotoFrame.append(addToPhotoFrameButton);

    // The 'open in Google Photos' link.
    const linkToGooglePhotos =
        $('<a />').attr('target', '_blank').attr('href', item.productUrl);
    secondaryContentRoot.append(linkToGooglePhotos);

    // The button for the 'open in Google Photos' link.
    const googlePhotosButton = $('<button />')
                                   .addClass('gp-button raised openInGpBtn')
                                   .text('Open in Google Photos');
    linkToGooglePhotos.append(googlePhotosButton);

    // Add the list item to the list of albums.
    $('#albums').append(materialDesignLiteList);
  });
  hideLoadingDialog();
  console.log('Albums loaded.');
  albumsAreVisible = true;
}

  
  // Shows a grid of media items in the photo frame.
  // The source is an object that describes how the items were loaded.
  // The media items are rendered on screen in a grid, with a caption based
  // on the description, model of the camera that took the photo and time stamp.
  // Each photo is displayed through the fancybox library for full screen and
  // caption support.
  function showPreview(source, mediaItems) {
    // console.log(source);
    // console.log(mediaItems);


    $('#images-container').empty();
  
    // Display the length and the source of the items if set.
    if (source && mediaItems) {
      $('#images-count').text(mediaItems.length);
      $('#images-source').text(JSON.stringify(source));
      $('#preview-description').show();
    } else {
      $('#images-count').text(0);
      $('#images-source').text('No photo search selected');
      $('#preview-description').hide();
    }
  
    // Show an error message and disable the slideshow button if no items are
    // loaded.
    if (!mediaItems || !mediaItems.length) {
      $('#images_empty').show();
      $('#startSlideshow').prop('disabled', true);
    } else {
      $('#images_empty').hide();
      $('startSlideshow').removeClass('disabled');
    }
  
    // Loop over each media item and render it.
    $.each(mediaItems, (i, item) => {
      // Construct a thumbnail URL from the item's base URL at a small pixel size.
      const thumbnailUrl = `${item.baseUrl}=w256-h256`;
      // Constuct the URL to the image in its original size based on its width and
      // height.
      const fullUrl = `${item.baseUrl}=w${item.mediaMetadata.width}-h${
          item.mediaMetadata.height}`;
  
      // Compile the caption, conisting of the description, model and time.
      const description = item.description ? item.description : '';
      const model = item.mediaMetadata.photo.cameraModel ?
          `#Shot on ${item.mediaMetadata.photo.cameraModel}` :
          '';
      const time = item.mediaMetadata.creationTime;
      const captionText = `${description} ${model} (${time})`
  
      // Each image is wrapped by a link for the fancybox gallery.
      // The data-width and data-height attributes are set to the
      // height and width of the original image. This allows the
      // fancybox library to display a scaled up thumbnail while the
      // full sized image is being loaded.
      // The original width and height are part of the mediaMetadata of
      // an image media item from the API.
      const linkToFullImage = $('<a />')
                                  .attr('href', fullUrl)
                                  .attr('data-fancybox', 'gallery')
                                  .attr('data-width', item.mediaMetadata.width)
                                  .attr('data-height', item.mediaMetadata.height);
      // Add the thumbnail image to the link to the full image for fancybox.
      const thumbnailImage = $('<img />')
                                 .attr('src', thumbnailUrl)
                                 .attr('alt', captionText)
                                 .addClass('img-fluid rounded thumbnail');
      linkToFullImage.append(thumbnailImage);
  
      // The caption consists of the caption text and a link to open the image
      // in Google Photos.
      const imageCaption =
          $('<figcaption />').addClass('hidden').text(captionText);
      const linkToGooglePhotos = $('<a />')
                                     .attr('href', item.productUrl)
                                     .text('[Click to open in Google Photos]');
      imageCaption.append($('<br />'));
      imageCaption.append(linkToGooglePhotos);
      linkToFullImage.append(imageCaption);
  
      // Add the link (consisting of the thumbnail image and caption) to
      // container.
      $('#images-container').append(linkToFullImage);
    });

    
  };
  
  // Makes a backend request to display the queue of photos currently loaded into
  // the photo frame. The backend returns a list of media items that the user has
  // selected. They are rendered in showPreview(..).
  function loadQueue() {
    //showLoadingDialog();
    // $.ajax({
    //   type: 'GET',
    //   url: '/getQueue',
    //   dataType: 'json',
    //   success: (data) => {
    //     // Queue has been loaded. Display the media items as a grid on screen.
    //     hideLoadingDialog();
    //     showPreview(data.parameters, data.photos);
    //     hideLoadingDialog();
    //     console.log('Loaded queue.');
    //   },
    //   error: (data) => {
    //     hideLoadingDialog();
    //     handleError('Could not load queue', data)
    //   }
    // });
    //const filters = {contentFilter: {}, mediaTypeFilter: {mediaTypes: ['PHOTO']}};
  //   gapi.client.request({
  //     'path': 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
  //     'method': 'POST' 
  // }).then(function (response) {
  //     console.log(response); 
  //     //showPreview(filters, response.result.mediaItems); 

  // }, function (reason) {
  //     console.log(reason);
  // });
  //listMediaItems();
  }
  
  var albumsAreVisible = false;
  var albumsWereListed = false;
  $(document).ready(() => {
    // Load the queue of photos selected by the user for the photo
    loadQueue();
  
    // Set up the fancybox image gallery.
    $().fancybox({
      selector: '[data-fancybox="gallery"]',
      loop: true,
      buttons: ['slideShow', 'fullScreen', 'close'],
      image: {preload: true},
      transitionEffect: 'fade',
      transitionDuration: 1000,
      fullScreen: {autoStart: false},
      // Automatically advance after 3s to next photo.
      slideShow: {autoStart: true, speed: 3000},
      // Display the contents figcaption element as the caption of an image
      caption: function(instance, item) {
        return $(this).find('figcaption').html();
      }
    });
  
    // Clicking the 'view fullscreen' button opens the gallery from the first
    // image.
    $('#startSlideshow')
        .on('click', (e) => $('#images-container a').first().click());
  
    // Clicking log out opens the log out screen.
    $('#logout').on('click', (e) => {
      window.location = '/logout';
    });

    $('#albumTitle').on('click', (e) => {
      if (albumsAreVisible == false){
        if (albumsWereListed == false){
          listAlbums(true);
        }
        albumsWereListed = true;

        var rightArrow = document.getElementById("rightArrow");
        rightArrow.style.display = 'block';

        var downArrow = document.getElementById("downArrow");
        downArrow.style.display = 'none';

      }
      else{
        var albums = document.getElementById("albums");
        albums.style.display = 'none';

        var rightArrow = document.getElementById("rightArrow");
        rightArrow.style.display = 'none';

        var downArrow = document.getElementById("downArrow");
        downArrow.style.display = 'block';
      }
    
    });

    
  });