$(function () {
  // Initialize Packery grid layout
  var $grid = $(".grid").packery({
    itemSelector: ".grid-item",
  });

  // Click event for grid items (expanding and collapsing)
  $(".grid-item").on("click",  function (e) {
    e.stopPropagation();
    $(this).toggleClass("grid-item--large");
    $grid.packery("layout");
    if ($(".expanded-information").hasClass("hide")) {
      $(".tile-info").addClass("hide");
      $(".expanded-information").removeClass("hide");
      $("#expanded-viewing-container > div").addClass("hide");
      $("#home").removeClass("hide");
    }
  });

  $(document).on("click", function () {
    $(".grid-item").removeClass("grid-item--large");
    $(".tile-info").removeClass("hide");
    $(".expanded-information").addClass("hide");
    $grid.packery("layout");
  });

  $(".left-options div").on("click", function () {
    const selectedClass = $(this).attr("class");
    const selectedDiv = $(`#${selectedClass}`);

    // If the clicked option is already active, revert to home
    if (!selectedDiv.hasClass("hide")) {
      $("#expanded-viewing-container > div").addClass("hide");
      $("#home").removeClass("hide");
    } else {
      // Hide all other divs, show only the selected one
      $("#expanded-viewing-container > div").addClass("hide");
      selectedDiv.removeClass("hide");
    }
  });
});
