(function ($) {
  // var assignments = [
  //   {
  //     name: "Yellow Assignment",
  //     status: "Active",
  //     category: "Interest",
  //     image_url: "assets/images/dashboard/article-1.png",
  //     deadline: "03/04/2025",
  //   },
  //   {
  //     name: "Blue Assignment",
  //     status: "Active",
  //     category: "Interest",
  //     image_url: "assets/images/dashboard/article-1.png",
  //     deadline: "03/04/2025",
  //   },
  // ];
  // var categoriesList = ["Challenge", "Interest", "Quiz Score"];
  var assignmentCount = 1;

  $(document).ready(function () {
    //flori: update count for each assignment
    $(".assignment").each(function () {
      if (!$(this).hasClass("counted")) {
        $(this).find(".assignment-counter").text(assignmentCount);
        $(this).addClass("counted");
        assignmentCount++;
      }
    });

    $(function () {
      $(".calendar-container").calendar();
    });
    $(".calendar-container").calendar({
      date: new Date(),
    });

    var $grid = $("#assignments-container > ul").packery({
      itemSelector: ".assignment",
    });

    // Click event for grid items (expanding and collapsing)
    $(".assignment").on("click", function (e) {
      e.stopPropagation();
      $(this).toggleClass("grid-item--large");
      $grid.packery("layout");
      if ($(".expanded-information").hasClass("hide")) {
        $(".tile-info").addClass("hide");
        $(".expanded-information").removeClass("hide");
        $("#expanded-viewing-container").removeClass("hide");
        $("#home").removeClass("hide");
        $grid.packery("layout");
      }
    });

    $(document).on("click", function () {
      $(".assignment").removeClass("grid-item--large");
      $(".tile-info").removeClass("hide");
      $(".expanded-information").addClass("hide");
      $("#expanded-viewing-container").addClass("hide");
      $("#expanded-viewing-container > div").addClass("hide");
      $grid.packery("layout");
    });

    // $(".left-options div").on("click", function () {
    //   const selectedClass = $(this).attr("class");
    //   const selectedDiv = $(`#${selectedClass}`);

    //   // If the clicked option is already active, revert to home
    //   if (!selectedDiv.hasClass("hide")) {
    //     $("#expanded-viewing-container > div").addClass("hide");
    //     $("#home").removeClass("hide");
    //   } else {
    //     // Hide all other divs, show only the selected one
    //     $("#expanded-viewing-container > div").addClass("hide");
    //     selectedDiv.removeClass("hide");
    //   }
    // });
  });

  // flori: sort based on active/inactive

  $("#left-options button").on("click", function () {
    $("#left-options button").each(function () {
      $(this).removeClass("active");
      $(this).removeClass("blue");
      $(this).find("div").removeClass("counter-blue");
    });
    $(this).toggleClass("active");
    $(this).toggleClass("blue");
    $(this).find("div").toggleClass("counter-blue");
    // Get 'active-type' attribute of the clicked button
    const selectedClass = $(this).attr("active-type");

    if (
      $("#active-button").hasClass("active") ||
      $("#inactive-button").hasClass("active")
    ) {
      // Hide all assignments and only show those that match the selected type
      $(".assignment").each(function () {
        // Toggle visibility based on the active-type match
        $(this).toggleClass(
          "hide",
          $(this).attr("active-type") !== selectedClass
        );
      });
      $(this).find(div).toggleClass("hide");
    } else {
      $("#left-options button").each(function () {
        // Toggle visibility based on the active-type match
        $(this).removeClass("active");
      });
      $("#all-button").addClass("active");
      $(".assignment").each(function () {
        $(this).removeClass("hide");
      });
    }
  });

  //flori: mark all assignments as active/inactive
  $(document).on("click", "#all-checkbox", function () {
    $(this).toggleClass("active");
    $("#checkmark").toggleClass("hide");

    $(".assignment").each(function () {
      if ($(this).hasClass("active") && $(".all-checkbox").hasClass("active")) {
        console.log("hello");
        $(this).removeClass("active");
        $(this).find(".assignment-button").removeClass("active");
      }
    });

    $(".assignment").each(function () {
      $(this).toggleClass("active");
      $(this).find(".assignment-button").toggleClass("active");
    });
  });

  //flori: minimize/maximize sidebar
  $(document).on("click", "#minimize-button", function () {
    $("#left-sidebar").addClass("hide");
    $("#minimized-sidebar").removeClass("hide");

    $("#assignments-container").css({ width: "calc(100vw - 60px)" });
    // $("#assignments-container > ul").css({
    //   "grid-template-columns": "240px 240px 240px 240px 240px",
    // });
  });
  $(document).on("click", "#expand-button", function () {
    $("#left-sidebar").removeClass("hide");
    $("#minimized-sidebar").addClass("hide");

    $("#assignments-container").css({ width: "calc(100vw - 285px)" });
    // $("#assignments-container > ul").css({
    //   "grid-template-columns": "240px 240px 240px 240px",
    // });
  });

  //flori: mark clicked assignment as active
  $(document).on("click", ".assignment-button", function () {
    if ($("#all-checkbox").hasClass("active")) {
      $("#all-checkbox").removeClass("active");
    }
    $(this).toggleClass("active");
    var assignment = $(this).parent();
    assignment.toggleClass("active");
    assignmentSelection();
  });

  //flori: used when marking assignments as active/inactive
  function assignmentSelection() {
    if ($(".assignment").hasClass("active")) {
      $(".assignment").each(function () {
        if (!$(this).hasClass("active")) {
          $(this).addClass("not-selected");
        }
      });
    } else {
      $(".assignment").each(function () {
        if (!$(this).hasClass("active")) {
          $(this).removeClass("not-selected");
        }
      });
    }
  }
})(window.jQuery);
