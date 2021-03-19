<?php get_header(); ?>
<main>
<?php if ( have_posts() ) {
    while ( have_posts() ) {
        the_post();?>
        <h2><?php echo get_the_title() ?></h2>
        <?php the_content() ?>
    <?php  } // end while
} // end if
?>
</main>
<?php get_footer();