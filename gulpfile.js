// modules
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const newer = require('gulp-newer');                  // https://www.npmjs.com/package/gulp-newer
const imagemin = require('gulp-imagemin');            // https://www.npmjs.com/package/gulp-imagemin
const htmlclean = require('gulp-htmlclean');          // https://www.npmjs.com/package/gulp-htmlclean
const stripdebug = require('gulp-strip-debug');       // https://www.npmjs.com/package/gulp-strip-debug
const terser = require('gulp-terser');                // https://www.npmjs.com/package/gulp-terser
const sourcemaps = require('gulp-sourcemaps');        // https://www.npmjs.com/package/gulp-sourcemaps
const sass = require('gulp-sass');                    // https://www.npmjs.com/package/gulp-sass
const postcss = require('gulp-postcss');              // https://github.com/postcss/gulp-postcss
const autoprefixer = require('autoprefixer');         //https://www.npmjs.com/package/autoprefixer
const cssnano = require('cssnano');                   // https://www.npmjs.com/package/cssnano


const fs = require('fs');
//joining path of directory
const directoryPath = "src";
//passsing directoryPath and callback function


let iteration = 0
let allFiles = [];
let fileListData = ""
let dataBefore = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Menu index.html</title></head><body><h1>Menu</h1><ul>";
let dataAfter = "</ul></body></html>";

function updateIndex(){
    fileListData = ""
    fs.readdir(directoryPath, (err, files) => {
        if (err)
            console.log(err);
        else {

            allFiles = files
            updateIndexLoop()
        }
    });

    return new Promise(function(resolve, reject) {
        //console.log("HTTP Server Started");
        resolve();
    });
}

function updateIndexLoop(){
    do {
        //console.log(allFiles, 1)
        if(allFiles[0].endsWith(".html")){
            fileListData += " <li><a href=\""+allFiles[0]+"\">"+allFiles[0].replace(".html","")+"</a></li>"
            allFiles.splice(0,1)
        }
        else if(allFiles[0].includes(".")){
            allFiles.splice(0,1)
        }
        else {
            let dirFile = allFiles[0]
            let dir = directoryPath +'/'+dirFile+'/'
            fs.readdir(dir, (err, files) => {
                if (err)
                    console.log(err);
                else {
                    for (let j = 0; j < files.length; j++) {
                        allFiles.push(dirFile+'/'+files[j]);
                    }
                    iteration++;
                    updateIndexLoop()
                }
            });
            allFiles.splice(0,1);
            break
        }
    } while (allFiles.length !== 0)


    if(allFiles.length === 0)
    {
        let data = dataBefore + fileListData + dataAfter;
        fs.writeFile("src/index.html", data, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("index.html was updated");
        });
    }
}

// Dossiers du projet - Toujours travailler dans le dossier src, jamais dans le dossier dist
const folder = {
    src: 'src/',
    dist: 'dist/',
    wordpress: "theme/"
};


// Commande pour copier le normalize.css du dossier node-modules vers le dossier dist
const copier_normalize = function(){
    return gulp.src('node_modules/normalize.css/normalize.css')
        .pipe(gulp.dest(folder.dist +'/css'))
        .pipe(gulp.dest(folder.wordpress +'/css'))
};

// Processus d’optimisation des data
const optimiser_data = function() {
    var out = folder.dist + 'data/';

    return gulp.src(folder.src + 'data/**/*')     //Récupère tous les fichiers du dossier et des sous-dossiers.
        .pipe(newer(out))                           //Permets de traiter seulement les nouveaux fichiers ou ceux qui ont été modifiés.
        .pipe(imagemin({ optimizationLevel: 7 }))   //Optimisation des fichiers data au format PNG, JPEG, GIF et SVG.
        .pipe(gulp.dest(out))
        .pipe(gulp.dest(folder.wordpress + 'data/'));                      //Copie tous les fichiers optimisés vers la destination.
};
const optimiser_data_temp = function() {
    var out = folder.dist + 'datatemp/';

    return gulp.src(folder.src + 'datatemp/**/*')     //Récupère tous les fichiers du dossier et des sous-dossiers.
        .pipe(newer(out))                           //Permets de traiter seulement les nouveaux fichiers ou ceux qui ont été modifiés.
        .pipe(imagemin({ optimizationLevel: 7 }))   //Optimisation des fichiers data au format PNG, JPEG, GIF et SVG.
        .pipe(gulp.dest(out))//Copie tous les fichiers optimisés vers la destination.
};

// Processus d’optimisation du HTML
const optimiser_html = function() {
    var out = folder.dist;

    return gulp.src(folder.src + '/**/*.html')      //Récupère tous les fichiers du dossier et des sous-dossiers.
        .pipe(newer(out))                           //Permets de traiter seulement les nouveaux fichiers ou ceux qui ont été modifiés.
        .pipe(htmlclean())                          //Reformate le html sur une seule ligne
        .pipe(gulp.dest(out));                      //Copie tous les fichiers optimisés vers la destination.


};

// Processus d’optimisation du CSS
const optimiser_css = function() {

    var postCssOpts = [
        autoprefixer({ overrideBrowserslist: ['last 2 versions', '> 2%'] })
        ,cssnano
    ];

    return gulp.src(folder.src + 'scss/main.scss')
        .pipe(sourcemaps.init())                    //Permets de retrouver la ligne problématique dans le fichier original.
        .pipe(sass({                                //Fais la compilation des fichiers SASS
            outputStyle: 'expanded',
            imagePath: 'data/',
            precision: 4,
            errLogToConsole: true
        }))
        .pipe(postcss(postCssOpts))                 //Permet de faire des actions sur le css comme l'autoprefixeur et la compression du code
        .pipe(sourcemaps.write())                   //Permets de retrouver la ligne problématique dans le fichier original.
        .pipe(gulp.dest(folder.dist + 'css/'))
        .pipe(gulp.dest(folder.wordpress + 'css/'));

};


// Processus d’optimisation du JavaScript
const optimiser_js = function() {
    var out = folder.dist;

    return gulp.src(folder.src + 'js/**/*')         //Récupère tous les fichiers du dossier et des sous-dossiers.
        .pipe(sourcemaps.init())                    //Permets de retrouver la ligne problématique dans le fichier original.
        //TODO enlever le commentaire de stripdebug avant de mettre en ligne
        //.pipe(stripdebug())                         //Supprime tous les commentaires et les lignes de « débogage »
        .pipe(terser())                           //Reformate le script sur une seule ligne
        .pipe(sourcemaps.write())                   //Permets de retrouver la ligne problématique dans le fichier original.
        .pipe(gulp.dest(out + 'js/'))             //Copie tous les fichiers optimisés vers la destination.
        .pipe(gulp.dest(folder.wordpress + 'js/'));
};

// Processus qui vérifie s'il y a eu un changement dans le dossier et exécute le processus qui s'y rattache
const watch = function() {

    // image changes
    gulp.watch(folder.src + 'data/**/*', gulp.parallel(optimiser_data));

    gulp.watch(folder.src + 'datatemp/**/*', gulp.parallel(optimiser_data_temp));

    // html changes
    gulp.watch(folder.src + '**/*', gulp.parallel(optimiser_html));


    gulp.watch([folder.src + '**/*.html', "!src/index.html"], gulp.parallel(updateIndex));

    // javascript changes
    gulp.watch(folder.src + 'js/**/*', gulp.parallel(optimiser_js));

    // css changes
    gulp.watch(folder.src + 'scss/**/*', gulp.parallel(optimiser_css));

};

//Processus qui lance le serveur Web local et qui recharge la page lorsqu'il y a un changement avec les fichiers CSS, HTML et JS
const serveur = function () {

    //Lancement du serveur
    browserSync.init({
        port: 3000,
        server: "./dist/",
        ghostMode: false,
        notify: false,
        //chrome pour PC et google chrome pour MAC
         browser: ["chrome"]
        //browser: ["opera"]
        //browser: ["firefox", "google chrome"]
    });

    //Vérification si quelque chose change et recharge la page
    gulp.watch('**/*.css').on('change', browserSync.reload);
    gulp.watch('**/*.html').on('change', browserSync.reload);
    gulp.watch('**/*.js').on('change', browserSync.reload);

};


gulp.task('copier_normalize', copier_normalize);
gulp.task('optimiser_data', optimiser_data);
gulp.task('optimiser_data_temp', optimiser_data_temp);
gulp.task('update_index_list', updateIndex);
gulp.task('optimiser_html', gulp.series('update_index_list', 'optimiser_data', 'optimiser_data_temp', optimiser_html));
gulp.task('optimiser_css', optimiser_css);
gulp.task('optimiser_js', optimiser_js);
gulp.task('watch', watch);
gulp.task('serveur', serveur);



// Processus pour exécuter chaque tâche peut importe l'ordre
gulp.task('execution', gulp.parallel('optimiser_html',  'optimiser_css', 'optimiser_js', 'copier_normalize'));


// Processus par défaut qui exécute chaque tâche une après l'autre
gulp.task('default', gulp.series( 'execution', gulp.parallel('watch', 'serveur')));
