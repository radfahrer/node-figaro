var fs = require('fs'),
    os = require('os');

// for node.js v0.6
if (!fs.existsSync) {
    fs.existsSync = function (path) {
        try {
            fs.statSync(path);
            return true;
        } catch (err) {
            return false;
        }
    }
}

var eol = os.platform
    ? ('win32' == os.platform() ? '\r\n' : '\n')
    : '\n';
exports.eol = eol;

var defaultFigaroJSONPath = 'figaro.json',
    defaultContents = ['{','}'].join(eol),
    defaultGitIgnorePath = '.gitignore';

exports.defaultContents = defaultContents;

exports.readFigaroJSONFile = function(figaroJSONPath) {
    figaroJSONPath = figaroJSONPath || defaultFigaroJSONPath;

    return fs.readFileSync(figaroJSONPath);
};

exports.setup = function (figaroJSONPath, contents, skipGitIgnore, gitIgnorePath) {
    figaroJSONPath = figaroJSONPath || defaultFigaroJSONPath;
    contents = contents || defaultContents;
    gitIgnorePath = gitIgnorePath || defaultGitIgnorePath;

    createFigaroJSONFile(figaroJSONPath, contents);
    if (!skipGitIgnore) {
        addToGitIgnore(gitIgnorePath, figaroJSONPath);
    }
};

function createFigaroJSONFile(figaroJSONPath, contents) {
    if (fs.existsSync(figaroJSONPath)) {
        log.warn(figaroJSONPath + ' already exists, we will not overwrite');
    } else {
        log.info('creating ' + figaroJSONPath);
        fs.writeFileSync(figaroJSONPath, contents);
    }
}

function addToGitIgnore(gitIgnorePath, figaroJSONPath) {
    var gitIgnoreContents = eol + figaroJSONPath + eol;

    if (!fs.existsSync(gitIgnorePath)) {
        createGitIgnoreFile(gitIgnorePath, gitIgnoreContents);
    } else {
        appendToGitIgnoreFile(gitIgnorePath, gitIgnoreContents);
    }
}

function createGitIgnoreFile(gitIgnorePath, gitIgnoreContents) {
    log.info('creating .gitignore and adding ' + gitIgnoreContents);
    fs.writeFileSync(gitIgnorePath, gitIgnoreContents);
}

function appendToGitIgnoreFile(gitIgnorePath, gitIgnoreContents) {
    if (alreadyAppendedToGitIgnoreFile(gitIgnorePath, gitIgnoreContents)) {
        log.info('.gitignore already ignores ' + gitIgnoreContents);
    } else {
        log.info('adding to .gitignore ' + gitIgnoreContents);
        var fd = fs.openSync(gitIgnorePath, 'a', null);
        fs.writeSync(fd, gitIgnoreContents, null, 'utf8');
        fs.close(fd);
    }
}

function alreadyAppendedToGitIgnoreFile(gitIgnorePath, gitIgnoreContents) {
    return fs.readFileSync(gitIgnorePath, 'utf8').indexOf(gitIgnoreContents) != -1;
}