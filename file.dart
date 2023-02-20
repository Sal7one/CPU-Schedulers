import 'dart:io';
import 'dart:typed_data';
import 'package:archive/archive.dart';

void main(List<String> arguments) {
  String zipFilePath = arguments[0];
  String passwordListPath = arguments[1];

  List<String> passwords = File(passwordListPath).readAsLinesSync();

  for (String password in passwords) {
    Uint8List bytes = File(zipFilePath).readAsBytesSync();
    Archive archive = ZipDecoder().decodeBytes(bytes, password: password);
    if (archive != null) {
      print('Password found: $password');
      break;
    }
  }
}

// Just select
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';

class ZipFilePicker extends StatefulWidget {
  final Function(File) onZipFileSelected;

  ZipFilePicker({required this.onZipFileSelected});

  @override
  _ZipFilePickerState createState() => _ZipFilePickerState();
}

class _ZipFilePickerState extends State<ZipFilePicker> {
  File? _selectedZipFile;

  void _openFilePicker() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['zip'],
    );

    if (result != null) {
      setState(() {
        _selectedZipFile = File(result.files.single.path!);
      });
      widget.onZipFileSelected(_selectedZipFile!);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: _openFilePicker,
          child: Text('Select Zip File'),
        ),
        if (_selectedZipFile != null) ...[
          SizedBox(height: 16),
          Text('Selected file: ${_selectedZipFile!.path}'),
        ],
      ],
    );
  }
}


// improved

import 'dart:io';
import 'package:archive/archive.dart';

void extractZipFile(File zipFile, String password) {
  final bytes = zipFile.readAsBytesSync();
  final archive = ZipDecoder().decodeBytes(bytes, password: password);

  for (final file in archive) {
    if (file.isFile) {
      final fileName = file.name;
      final data = file.content as List<int>;
      final outFile = File(fileName);
      outFile.writeAsBytesSync(data, flush: true);
    }
  }
}

final zipFile = File('path/to/your/zip/file.zip');
final password = 'your-zip-file-password';

extractZipFile(zipFile, password);

