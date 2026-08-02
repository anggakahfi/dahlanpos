package usecase

import (
	"errors"
	"os"
	"time"

	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

// checkOperatingHours verifies if the current time is within the outlet's operating hours,
// considering a specific tolerance.
func checkOperatingHours(outlet *domain.Outlet, tolerance time.Duration) error {
	if os.Getenv("BYPASS_TIME_CHECK") == "true" || os.Getenv("BYPASS_TIME_CHECK") == "true\r" || len(os.Getenv("BYPASS_TIME_CHECK")) > 0 && os.Getenv("BYPASS_TIME_CHECK")[0] == 't' {
		return nil // Development bypass
	}

	if outlet.OpenTime == "" || outlet.CloseTime == "" {
		return nil // 24-hour outlet or not configured
	}

	loc, _ := time.LoadLocation("Asia/Jakarta")
	now := time.Now().In(loc)

	fmtStr := "15:04:05"
	if len(outlet.OpenTime) == 5 {
		fmtStr = "15:04"
	}

	openT, err1 := time.Parse(fmtStr, outlet.OpenTime)
	closeT, err2 := time.Parse(fmtStr, outlet.CloseTime)

	if err1 != nil || err2 != nil {
		return nil // Invalid time format, fallback to bypass
	}

	openHour := time.Date(now.Year(), now.Month(), now.Day(), openT.Hour(), openT.Minute(), 0, 0, loc)
	var closeHour time.Time

	// Use minute-level precision for cross-midnight comparison
	nowMinutes := now.Hour()*60 + now.Minute()
	closeMinutes := closeT.Hour()*60 + closeT.Minute()
	openMinutes := openT.Hour()*60 + openT.Minute()

	if closeMinutes < openMinutes {
		// Cross-midnight: e.g. open 17:00, close 02:00
		if nowMinutes <= closeMinutes {
			// After midnight, before close (e.g. 01:30)
			openHour = openHour.AddDate(0, 0, -1)
			closeHour = time.Date(now.Year(), now.Month(), now.Day(), closeT.Hour(), closeT.Minute(), 0, 0, loc)
		} else {
			// Before midnight, after open (e.g. 23:00)
			closeHour = time.Date(now.Year(), now.Month(), now.Day()+1, closeT.Hour(), closeT.Minute(), 0, 0, loc)
		}
	} else {
		closeHour = time.Date(now.Year(), now.Month(), now.Day(), closeT.Hour(), closeT.Minute(), 0, 0, loc)
	}

	closeHour = closeHour.Add(tolerance)

	if now.Before(openHour) || now.After(closeHour) {
		openDisplay := outlet.OpenTime
		if len(openDisplay) >= 5 {
			openDisplay = openDisplay[:5]
		}
		closeDisplay := outlet.CloseTime
		if len(closeDisplay) >= 5 {
			closeDisplay = closeDisplay[:5]
		}
		
		// Different error message based on whether there's a tolerance (expired vs normally closed)
		if tolerance > 0 {
			return errors.New("Waktu operasional outlet telah berakhir. Harap segera Tutup Shift. Jam operasional: " + openDisplay + " - " + closeDisplay)
		}
		return errors.New("outlet sedang tutup. Jam operasional: " + openDisplay + " - " + closeDisplay)
	}

	return nil
}

// checkShiftExpiration verifies if a shift is too old or past operating hours.
func checkShiftExpiration(shift *domain.Shift, outlet *domain.Outlet) error {
	if os.Getenv("BYPASS_TIME_CHECK") == "true" || os.Getenv("BYPASS_TIME_CHECK") == "true\r" || len(os.Getenv("BYPASS_TIME_CHECK")) > 0 && os.Getenv("BYPASS_TIME_CHECK")[0] == 't' {
		return nil // Development bypass
	}

	// 1. Check stale shift: if it was opened more than 24 hours ago
	if time.Since(shift.StartedAt) > 24*time.Hour {
		return errors.New("Waktu operasional outlet telah berakhir. Harap segera Tutup Shift.")
	}

	// 2. Check with 30-minute tolerance
	return checkOperatingHours(outlet, 30*time.Minute)
}
