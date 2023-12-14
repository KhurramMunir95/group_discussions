$(function() {
    const url = window.location.href;
    var match = url.match(/\/([^\/]+)\/?$/);
    var $group = match ? match[1] : null;

    if($group === 'posts') {
      $('#post_form').hide();
    } 

    // edit a post
    $(document).on('click', '.edit-post', function() {
        const $text = $(this).parents('.card').find('.card-text').text();
        const $id = $(this).parents('.card').attr('id');
        $('.post-text').val($text);
        $('.post_id').val($id);
    })

    // delete user (only for admin)
    $(document).on('submit', '#user_delete_form', function(e) {
      e.preventDefault();
      Swal.fire({
          title: "Are you sure you want to delete this user?",
          showCancelButton: true,
          icon: 'warning',
          confirmButtonText: "Delete",
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire("Post Deleted!", "", "success");
            e.currentTarget.submit();
          } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
          }
        });
    })

    function postsHTML(post) {
      const $postsContainer = $('#posts_container');
      const user = $postsContainer.data('user');
      console.log(user)
      const html = `<div class="card mb-5" id="${post._id}">
        <div class="card-header">
            <div class="media">
                <div>
                    <img class="rounded-circle" src="/uploads/images/${post.user.profileImage}" alt="profile-image">
                </div>
                <div>
                    <h6 class="mb-0">${post.user.username}</h6>
                    <span class="time">${moment(post.createdAt).fromNow()}</span>
                </div>
                ${ post.user._id == user ?
                  `<div class="dropdown">
                      <button class="btn btn-transparent dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      </button>
                      <ul class="dropdown-menu">
                          <li><button class="dropdown-item edit-post" type="button" data-bs-toggle="modal" data-bs-target="#postEditModal">Edit</button></li>
                          <li>
                              <form action="/posts/delete" id="post_delete_form" method="post">
                                  <input type="hidden" class="delete_id" name="post_id" value="${post._id}">
                                  <button class="dropdown-item" type="submit">Delete</button>
                              </form>
                          </li>
                      </ul>
                  </div>` : ``
                }
            </div>
        </div>
        <div class="card-body">
            <p class="card-text">${post.post}</p>
        </div>
        <div class="card-footer">
            <div class="likes"></div>
            <form method="post" id="post_like_form">
                <input type="hidden" name="post" value="${post._id}">
                <input type="hidden" name="likes" value="1">
                <button class="btn p-0" type="submit">
                    <i data-likes="0" class="like-btn bi ${post.likes > 0 && post.isLiked ? 'liked bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}"></i>
                </button>
            </form>
        </div>
    </div>`;
    $postsContainer.prepend(html);
    }

    // create a post
    $(document).on('submit', '#post_form', function(e) {
      e.preventDefault();
      const $post = $(this).find('textarea[name="post"]');
      // getting id from url
      const url = window.location.href;
      var match = url.match(/\/([^\/]+)\/?$/);
      var $group = match ? match[1] : null;
      const $data = {
        post: $post.val().trim(),
        group: $group
      }
      $.ajax({
        type: 'POST',
        url: '/posts/create',
        data: $data,
        success: function(res) {
          $post.val('');
          console.log(res.post)
          postsHTML(res.post);
        },
        error: function(error) {
          console.log(error);
        }
      })
    })

    // like a post
    $(document).on('submit', '#post_like_form', function(e) {
      e.preventDefault();
      const post = $(this).find('input[name="post"]').val(); //post text
      const $btn = $(this).find('.like-btn');
      $btn.toggleClass('liked bi-hand-thumbs-up-fill bi-hand-thumbs-up');
      const $likes = $btn.data('likes');
      const $likes_container = $(this).prev('.likes');
      let $totalLikes;
      if($btn.hasClass('liked')) {
        $totalLikes = $likes + 1;
        $btn.data('likes', $totalLikes);
      } else {
        $totalLikes = $likes - 1;
        $btn.data('likes', $totalLikes);
      }
      $likes_container.empty();
      if($totalLikes > 0) {
        $likes_container.append($totalLikes === 1 ? $totalLikes + ' like' : $totalLikes + ' likes');
      }
      $.ajax({
        type: 'POST',
        url: '/posts/like',
        data: {
          post: post,
          likes: 1,
        },
        success: function(res) {
        },
        error: function(error) {
          console.log(error);
        }
      })
    })

    // update a post 
    $(document).on('submit', '#post_edit_form', function(e) {
      e.preventDefault();
      const $id = $(this).find('input[name="post_id"]').val(); //post id
      const $post = $(this).find('textarea[name="post"]').val(); //post text
      $.ajax({
        type: 'POST',
        url: '/posts/update',
        data: {
          id: $id,
          post: $post
        },
        success: function(res) {
          // setting card text to the $post value
          $('#'+$id).find('.card-text').text($post);
          $('#postEditModal').modal('hide');
          console.log(res);
        },
        error: function(error) {
          console.log(error);
        }
      })
    })

    // delete a post
    $(document).on('submit', '#post_delete_form', function(e) {
      e.preventDefault();
      const $card = $(this).parents('.card');
      const $id = $card.attr('id'); //post id
      $('.delete_id').val($id);
      Swal.fire({
          title: "Are you sure you want to delete this post?",
          showCancelButton: true,
          icon: 'warning',
          confirmButtonText: "Delete",
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            // Swal.fire("Post Deleted!", "", "success");
            // e.currentTarget.submit();
            $.ajax({
              type: 'POST',
              url: '/posts/delete',
              data: {
                id: $id
              },
              success: function(res) {
                console.log(res);
                $card.remove();
              },
              error: function(error) {
                console.log(error);
              }
            })
          } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
          }
        });
    })
})