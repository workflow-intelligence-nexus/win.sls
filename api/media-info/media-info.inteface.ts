/**
 * This file should contain all required interfaces for the feature
 */

export interface MediaInfoUrl {
  url: string;
}

export interface MediaInfo {
  VideoCount: string;
  AudioCount: string;
  FileExtension: string;
  Format: string;
  Format_Profile: string;
  CodecID: string;
  CodecID_Compatible: string;
  FileSize: string;
  Duration: string;
  OverallBitRate_Mode: string;
  OverallBitRate: string;
  FrameRate: string;
  FrameCount: string;
  StreamSize: string;
  HeaderSize: string;
  DataSize: string;
  FooterSize: string;
  IsStreamable: string;
  Encoded_Application: string;
}
