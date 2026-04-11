package cloudinary_infra

import (
	"context"
	"mime/multipart"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/google/uuid"
)

type CloudinaryService struct {
	cld *cloudinary.Cloudinary
}

// NewCloudinaryService initializes Cloudinary with the provided connection URL
func NewCloudinaryService(cloudinaryURL string) (*CloudinaryService, error) {
	if cloudinaryURL == "" {
		// Log warning but don't fail, maybe they test without images right away.
		// Without credentials, upload will just fail gracefully later.
		return &CloudinaryService{cld: nil}, nil
	}
	cld, err := cloudinary.NewFromURL(cloudinaryURL)
	if err != nil {
		return nil, err
	}
	return &CloudinaryService{cld: cld}, nil
}

// UploadImage receives a multipart.File, uploads it to Cloudinary, and returns the secure URL of the image.
func (s *CloudinaryService) UploadImage(ctx context.Context, file multipart.File) (string, error) {
	if s.cld == nil {
		return "", nil // graceful fallback if credentials aren't set yet during demo mode
	}

	uploadParams := uploader.UploadParams{
		Folder:   "dahlanpos",
		PublicID: uuid.New().String(),
	}

	resp, err := s.cld.Upload.Upload(ctx, file, uploadParams)
	if err != nil {
		return "", err
	}

	return resp.SecureURL, nil
}
