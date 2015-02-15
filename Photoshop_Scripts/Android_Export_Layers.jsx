/*
 * Copyright (c) 2015 Ashung Hung (mailto:Ashung.hung@gmail.com)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Project Home: github.com/Ashung/GUI_Automation_Toolbox
 */

(function(){
    'use strict'
    
    // Costum dialog UI here.
    // Default Photoshop document dpi.
    var psdDPI = 'mdpi';
    // var psdDPI = 'xhdpi';
    // DPIs you want to export by default.
    var dpis = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
    // var dpis = ['xhdpi', 'xxhdpi', 'xxxhdpi'];
    
    if(documents.length == 0) {
        alert('Open Photoshop document first.', 'Android Export Layers');
        return;
    }  
    
    var dlg = 
    "dialog {\
        text: 'Export Layers for Android',\
        alignChildren: 'fill',\
        exportType: Group {\
            orientation: 'column',\
            alignChildren: 'left', \
            labelExport: StaticText { text: 'Layers:' },\
            radioGroup: Group {\
                orientation: 'row',\
                allLayers: RadioButton { \
                    value: true, \
                    text: 'All Layers' \
                },\
                childLayers: RadioButton { \
                    text: 'Child Layers in Selected LayerSet' \
                },\
            }\
        },\
        imageType: Group {\
            orientation: 'column',\
            alignChildren: 'left', \
            labelImageType: StaticText { text: 'Image Type:' },\
            radioGroup: Group {\
                orientation: 'row',\
                png24: RadioButton { \
                    value: true, \
                    text: 'PNG-24' \
                },\
                png8: RadioButton { \
                    value: false, \
                    text: 'PNG-8' \
                },\
                jpg80: RadioButton { \
                    value: false, \
                    text: 'JPG-80' \
                },\
                jpg60: RadioButton { \
                    value: false, \
                    text: 'JPG-60' \
                }\
            }\
        },\
        imageName: Group { \
            orientation: 'column',\
            alignChildren: 'left', \
            labelImageName: StaticText { text: 'Image Name:' },\
            namesDPIList: DropDownList {\
                size: [300, 25] \
            } \
        }, \
        imageNamePrefix: Group { \
            orientation: 'column',\
            alignChildren: 'left', \
            labelPrefix: StaticText { text: 'Image Prefix and Suffix:' },\
            prefixText: EditText {\
                size: [300, 25] \
            }\
        }, \
        outputFolder: Group {\
            orientation: 'column',\
            alignChildren: 'left', \
            labeloutput: StaticText { text: 'Output Folder:' },\
            outputForm: Group {\
                orientation: 'row',\
                outputText: EditText {\
                    size: [210, 25] \
                },\
                outputBrowser: Button { \
                    text: 'Browser...', \
                    size: [80, 25] \
                }\
            }\
        },\
        docDPI: Group {\
            orientation: 'column',\
            alignChildren: 'left', \
            labelDocDPI: StaticText { text: 'Document DPI:' },\
            docDPIList: DropDownList {\
                size: [300, 25] \
            }\
        },\
        exportDPI: Group {\
            orientation: 'column',\
            alignChildren: 'left', \
            labelExport: StaticText { text: 'Export DPIs:'},\
            dpis: Group {\
                orientation: 'row' \
            }\
        },\
        separator: Panel { preferredSize: [300, 0] },\
        buttons: Group {\
            orientation: 'row',\
            cancelBtn: Button {\
                alignment: ['right', 'center'], \
                text: 'Cancel'\
            },\
            runBtn: Button {\
                alignment: ['right', 'center'], \
                text: 'OK'\
            }\
        }\
    }";
    
    var AEL = new Window(dlg);
    
    if(documents.length == 0) {
        return;
    }
    
    // Export all layer.
    var exportAllLayer = AEL.exportType.radioGroup.allLayers;
    
    // Image Types.
    var imageType = 'png24';
    var imageExt = '.png';
    var imageType_png24 = AEL.imageType.radioGroup.png24;
    var imageType_png8 = AEL.imageType.radioGroup.png8;
    var imageType_jpg80 = AEL.imageType.radioGroup.jpg80;
    var imageType_jpg60 = AEL.imageType.radioGroup.jpg60;
    
    if(imageType == 'png24') {
        imageType_png24.value = true;
        imageExt = '.png';
    }
    if(imageType == 'png8') {
        imageType_png8.value = true;
        imageExt = '.png';
    }
    if(imageType == 'jpg80') {
        imageType_jpg80.value = true;
        imageExt = '.jpg';
    }
    if(imageType == 'jpg60') {
        imageType_jpg60.value = true;
        imageExt = '.jpg';
    }

    // Initialize Image Name DropDownList.
    var imageNames = AEL.imageName.namesDPIList;
    var prefix = AEL.imageNamePrefix.prefixText;
        prefix.enabled = false;

        imageNames.add('item', 'layer_name' + imageExt);
        imageNames.add('item', '[Prefix]_layer_name' + imageExt);
        imageNames.add('item', 'layer_name_[Suffix]' + imageExt);
        imageNames.add('item', '[Prefix]_[1,2,3...]' + imageExt + ' (From top to bottom)');
        imageNames.add('item', '[Prefix]_[01,02,03...]' + imageExt + ' (From top to bottom)');
        imageNames.add('item', '[Prefix]_[001,002,003...]' + imageExt + ' (From top to bottom)');
        
        imageNames.selection = imageNames.items[0];
        
        imageNames.onChange = function() {
            if(imageNames.selection.index == 0) {
                prefix.enabled = false;
            } else {
                prefix.enabled = true;
            }
        }
    
    imageType_png24.onClick = function() {
        imageType = 'png24'
        imageExt = '.png';
        changeDropDownList();
    }
    imageType_png8.onClick = function() {
        imageType = 'png8'
        imageExt = '.png';
        changeDropDownList();
    }
    imageType_jpg80.onClick = function() {
        imageType = 'jpg'
        imageExt = '.jpg';
        changeDropDownList();
    }
    imageType_jpg60.onClick = function() {
        imageType = 'jpg'
        imageExt = '.jpg';
        changeDropDownList();
    }
    function changeDropDownList() {
        imageNames.items[0].text = 'layer_name' + imageExt;
        imageNames.items[1].text = '[Prefix]_layer_name' + imageExt;
        imageNames.items[2].text = 'layer_name_[Suffix]' + imageExt;
        imageNames.items[3].text = '[Prefix]_[1,2,3...]' + imageExt + ' (From top to bottom)';
        imageNames.items[4].text = '[Prefix]_[01,02,03...]' + imageExt + ' (From top to bottom)';
        imageNames.items[5].text = '[Prefix]_[001,002,003...]' + imageExt + ' (From top to bottom)';
    }
        
    // Initialize Path.
    var outputFolder = AEL.outputFolder.outputForm.outputText;
    var outputBrowser = AEL.outputFolder.outputForm.outputBrowser;
    
    try {
        if(/\/drawable-(nodpi|ldpi|mdpi|hdpi|xhdpi|xxhdpi|xxxhdpi)/i.test(String(activeDocument.path))) {
            outputFolder.text = String(activeDocument.path).replace(/\/drawable-(nodpi|ldpi|mdpi|hdpi|xhdpi|xxhdpi|xxxhdpi)/i, '');
        } else {
            outputFolder.text = activeDocument.path + '/res';
        }
    } catch(e) {
        outputFolder.text = Folder.desktop.fullName + '/res';
    }
    
    outputBrowser.onClick = function() {
        var f = Folder(outputFolder.text).selectDlg('Select folder:');
        if(f != null)
            outputFolder.text = f.fullName;
    } 

    // Initialize docDPI DropDownList.
    var docDPIList = AEL.docDPI.docDPIList;
    var docDPI;
    
    for(var i = 0; i < dpis.length; i ++) {
        docDPIList.add('item', dpis[i]);
        if(dpis[i] == psdDPI) {
            docDPIList.selection = docDPIList.items[i];
            docDPI = docDPIList.selection.text;
        }
    }
    docDPIList.onChange = function() {
        docDPI = docDPIList.selection.text;
    }

    // Initialize Export DPI.
    for(var i = 0; i < dpis.length; i ++) {
        eval('AEL.exportDPI.dpis.' + dpis[i] + ' = AEL.exportDPI.dpis.add("Checkbox", undefined, "' + dpis[i] + '")');
        eval('AEL.exportDPI.dpis.' + dpis[i] + '.value = true');
    }

    // Button event.
    AEL.buttons.runBtn.onClick = function() {
        
        this.enabled = false;
        
        var rootLayer = activeDocument;
        if(!exportAllLayer.value) {
            rootLayer = activeDocument.activeLayer;
        }
        
        // ImageType
        if(imageType_png24.value) {
            imageType = 'png24';
            imageExt = 'png';
        }
        if(imageType_png8.value) {
            imageType = 'png8';
            imageExt = 'png';
        }
        if(imageType_jpg80.value) {
            imageType = 'jpg';
            imageExt = 'jpg';
        }
        if(imageType_jpg60.value) {
            imageType = 'jpg';
            imageExt = 'jpg';
        }

        // exportDPIs
        var exportDPIs = [];
        for(var i = 0; i < dpis.length; i ++) {
            eval('if(AEL.exportDPI.dpis.' + dpis[i] + '.value == true){exportDPIs.push("' + dpis[i] + '")};');
        }
        
        for(var i = 0; i < exportDPIs.length; i ++) {

            var targetDPI = exportDPIs[i];
            var outputImageParent = outputFolder.text + '/drawable-' + targetDPI + '/';
            
            var d = new Date();
            var timeStamp = d.getTime();
            
            activeDocument.suspendHistory('History_' + timeStamp, '');
            
            resize(density(targetDPI)/density(docDPI));
            
            // Hide layers
            for(var j = 0; j < rootLayer.layers.length; j ++) {
                rootLayer.layers[j].visible = false;
            }
            
            // Export layers
            for(var j = 0; j < rootLayer.layers.length; j ++) {
                // layer_name.png
                var outputImageName = rootLayer.layers[j].name.toLowerCase().replace(/ /g, '_').replace(/.(jpg|jpeg|gif|png)$/i, '') + '.' + imageExt;
                // [Prefix]_layer_name.png
                if(imageNames.selection.index == 1) {
                    outputImageName = prefix.text + '_' + outputImageName;
                }
                // layer_name_[Prefix].png
                if(imageNames.selection.index == 2) {
                    outputImageName = rootLayer.layers[j].name.toLowerCase().replace(/ /g, '_').replace(/.(jpg|jpeg|gif|png)$/i, '') + '_' + prefix.text + '.' + imageExt;
                }
                // [Prefix]_[1,2,3...].png
                if(imageNames.selection.index == 3) {
                    outputImageName = prefix.text + '_' + formatNumber(j+1, 1) + '.' + imageExt;
                }
                // [Prefix]_[01,02,03...].png
                if(imageNames.selection.index == 4) {
                    outputImageName = prefix.text + '_' + formatNumber(j+1, 2) + '.' + imageExt;
                }
                // [Prefix]_[01,02,03...].png
                if(imageNames.selection.index == 5) {
                    outputImageName = prefix.text + '_' + formatNumber(j+1, 3) + '.' + imageExt;
                }
            
                if(j > 0) {
                    rootLayer.layers[j-1].visible = false;
                }
                rootLayer.layers[j].visible = true;
                
                // Export Default ImageType
                if(imageType_png24.value) {
                    exportPng(outputImageParent + outputImageName);
                }
                if(imageType_png8.value) {
                    exportPng8(outputImageParent + outputImageName);
                }
                if(imageType_jpg80.value) {
                    exportJpg(outputImageParent + outputImageName, 80);
                }
                if(imageType_jpg60.value) {
                    exportJpg(outputImageParent + outputImageName, 60);
                }

                //$.writeln('x' + density(targetDPI)/density(docDPI) + ' -----> ' + outputImageParent + outputImageName);
            }
        
            activeDocument.activeHistoryState = activeDocument.historyStates.getByName('History_' + timeStamp);
        }

        //$.writeln('Completed!');
        
        AEL.close();
    }
    
    AEL.show();

    /*
     * @param String dpiKeyword [nodpi|ldpi|mdpi|hdpi|tvdpi|xhdpi|xxhdpi|xxxhdpi]
     */
    function density(dpiKeyword) {
        if(parseInt(dpiKeyword) > 0) {
            return parseInt(dpiKeyword);
        } else {
            switch(dpiKeyword.toLowerCase()) {
                case 'ldpi':
                    return 120;
                case 'mdpi':
                    return 160;
                case 'tvdpi':
                    return 213;
                case 'hdpi':
                    return 240;
                case 'xhdpi':
                    return 320;
                case 'xxhdpi':
                    return 480;
                case 'xxxhdpi':
                    return 640;
                default:
                    return 160;
            }
        }
    }

    /*
     * @param Float scale
     */
    function resize(scale) {
        var desc1 = new ActionDescriptor();
            desc1.putUnitDouble(charIDToTypeID('Wdth'), charIDToTypeID('#Prc'), scale * 100);
            desc1.putBoolean(stringIDToTypeID("scaleStyles"), true);
            desc1.putBoolean(charIDToTypeID('CnsP'), true);
            desc1.putEnumerated(charIDToTypeID('Intr'), charIDToTypeID('Intp'), charIDToTypeID('Bcbc'));
        executeAction(stringIDToTypeID('imageSize'), desc1, DialogModes.NO);
    }

    /*
     * @param String path
     */
    function exportPng(path) {
        // Create Folder
        if(!File(path).parent.exists) {
            File(path).parent.create();
        }
    
        // File readonly
        if(File(path).exists && File(path).readonly == true) {
            File(path).readonly = false;
        }
        var png24Options = new ExportOptionsSaveForWeb();
            png24Options.format = SaveDocumentType.PNG;
            png24Options.PNG8 = false;
            png24Options.transparency = true;
            png24Options.interlaced = false;
            png24Options.includeProfile = false;
        activeDocument.exportDocument(File(path), ExportType.SAVEFORWEB, png24Options);
    }

    /*
     * @param String path
     */
    function exportPng8(path) {
        // Create Folder
        if(!File(path).parent.exists) {
            File(path).parent.create();
        }
        // File readonly
        if(File(path).exists && File(path).readonly == true) {
            File(path).readonly = false;
        }
        var png8Options = new ExportOptionsSaveForWeb();
            png8Options.format = SaveDocumentType.PNG;
            png8Options.PNG8 = true;
            png8Options.colors = 256;
            png8Options.colorReduction = ColorReductionType.PERCEPTUAL;
            png8Options.dither = Dither.NONE;
            png8Options.transparency = true;
            png8Options.matteColor = app.backgroundColor.rgb;
            png8Options.interlaced = false;
            png8Options.includeProfile = false;
        activeDocument.exportDocument(File(path), ExportType.SAVEFORWEB, png8Options);
    }

    /*
     * @param String path
     * @param Number quality 
     */
    function exportJpg(path, quality) {
        // Create Folder
        if(!File(path).parent.exists) {
            File(path).parent.create();
        }
        // File readonly
        if(File(path).exists && File(path).readonly == true) {
            File(path).readonly = false;
        }
        var jpgOptions = new ExportOptionsSaveForWeb();
            jpgOptions.format = SaveDocumentType.JPEG;
            jpgOptions.optimized = true;
            jpgOptions.quality = quality;
            jpgOptions.matteColor = app.backgroundColor.rgb;
            jpgOptions.interlaced = false;
            jpgOptions.includeProfile = false;
        activeDocument.exportDocument(File(path), ExportType.SAVEFORWEB, jpgOptions);
    }

    /*
     * @param Number number
     * @param Number length > 0
     */
    function formatNumber(number, length) {
        while(String(number).length < length) {
            number = '0' + number;
            formatNumber(number, length);
        }
        return number;
    }

})();