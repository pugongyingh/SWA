if (document.querySelector('#youtube-parent')) {

    const videoItems = document.querySelectorAll('.video-item');
    const player = document.querySelector('.player');

    /* Open */
    function openNav() {
        document.querySelector('#youtube-parent').style.height = "100%";
    }

    /* Close */
    function closeNav() {
        player.setAttribute('src','');
        document.querySelector('#youtube-parent').style.height = "0%";
    }

    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            player.setAttribute('src', `https://www.youtube.com/embed/${item.getAttribute('id')}?controls=1`);
            openNav();
        });
     });
}
