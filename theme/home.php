<?php get_header(); ?>
<main>
    <?php if (have_posts()) : ?>
        <?php while (have_posts()) : the_post(); ?>
            <article>
                <?php the_post_thumbnail(); ?>
                <h2><?php the_title(); ?></h2>
                <span><?php the_time("j F Y"); ?></span>
                <p><?php echo  get_the_excerpt(); ?></p>
                <a href="<?php echo the_permalink(); ?>">Lire l'article</a>
            </article>
        <?php endwhile; ?>
    <?php endif; ?>
</main>
<?php get_footer(); ?>