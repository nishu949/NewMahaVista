import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import festivals from "../data/festivals";
import { useLanguage } from "../context/LanguageContext"; // ✅ ADDED

const FestivalCalendar = () => {
  const navigate = useNavigate();
  const { t } = useLanguage(); // ✅ ADDED

  // ================= SEARCH =================

  const [search, setSearch] = useState("");

  // ================= REMINDER =================

  const [reminder, setReminder] = useState(() => {
    const savedReminder = localStorage.getItem("festivalReminder");

    if (savedReminder === null) {
      return true;
    }

    return savedReminder === "true";
  });

  // ================= CALENDAR =================

  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth()
  );

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  );

  const [selectedDate, setSelectedDate] = useState(null);

  // ================= AUDIO =================

  const audioContextRef = useRef(null);
  const soundPlayedRef = useRef(false);

  // ================= FESTIVAL ICONS =================

  const festivalIcons = {
    "Makar Sankranti": "🪁",
    Pongal: "🌾",
    Lohri: "🔥",

    "Maha Shivratri": "🔱",
    "Magha Purnima": "🌕",
    "Ratha Saptami": "☀️",

    Holi: "🎨",
    Dhulivandan: "🌈",
    "Rang Panchami": "🎨",

    "Gudi Padwa": "🚩",
    "Ram Navami": "🏹",
    "Hanuman Jayanti": "🙏",

    "Buddha Purnima": "🪷",
    "Akshaya Tritiya": "✨",
    "Vat Savitri": "🌳",

    "Jagannath Rath Yatra": "🛕",
    "Guru Purnima": "📿",
    "Yogini Ekadashi": "🪔",

    "Kanwar Yatra": "🔱",
    "Kartikeya Jayanti": "🦚",

    "Raksha Bandhan": "🎀",
    Janmashtami: "🦚",
    "Ganesh Chaturthi": "🐘",

    "Ganesh Visarjan": "🙏",
    "Anant Chaturdashi": "🪔",

    "Navratri Begins": "🌺",
    Navratri: "🌺",

    Dussehra: "🏹",
    "Karwa Chauth": "🌙",

    Diwali: "🪔",
    "Govardhan Puja": "🐄",
    "Bhai Dooj": "🎁",

    "Margashirsha Purnima": "🌕",
    "Vaikuntha Ekadashi": "🪷",
    "Gita Jayanti": "📖",
  };

  // ================= MONTH NAMES =================

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December",
  ];

  const weekDays = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
  ];

  // ================= ALL FESTIVALS =================

  const allFestivals = festivals.flatMap((month) =>
    month.festivals.map((festival) => ({
      ...festival,
      month: month.month,
    }))
  );

  // ================= DATE CONVERTER =================

  const convertDate = (dateString) => {
    const [day, month, year] = dateString.split(" ");

    const monthNumbers = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, 
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };

    return new Date(
      Number(year),
      monthNumbers[month],
      Number(day)
    );
  };

  // ================= TODAY =================

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ================= UPCOMING FESTIVALS =================

  const upcomingFestivals = allFestivals
    .filter((festival) => {
      const festivalDate = convertDate(festival.date);
      return festivalDate >= today;
    })
    .sort((a, b) => {
      return (
        convertDate(a.date).getTime() -
        convertDate(b.date).getTime()
      );
    })
    .slice(0, 6);

  // ================= SAVE REMINDER =================

  useEffect(() => {
    localStorage.setItem(
      "festivalReminder",
      reminder
    );
  }, [reminder]);

  // ================= REMINDER DATE =================

  const getReminderDate = (festivalDate) => {
    const reminderDate = new Date(festivalDate);
    reminderDate.setDate(reminderDate.getDate() - 10);
    return reminderDate;
  };

  // ================= ACTIVE REMINDERS =================

  const reminderFestivals = allFestivals.filter(
    (festival) => {
      const festivalDate = convertDate(festival.date);
      const reminderDate = getReminderDate(festivalDate);

      return (
        today >= reminderDate &&
        today < festivalDate
      );
    }
  );

  // =====================================================
  // SOUND FUNCTION
  // =====================================================

  const playReminderSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const currentTime = audioContext.currentTime;

      // FIRST SOUND
      const oscillator1 = audioContext.createOscillator();
      const gainNode1 = audioContext.createGain();

      oscillator1.type = "sine";
      oscillator1.frequency.setValueAtTime(800, currentTime);

      gainNode1.gain.setValueAtTime(0.0001, currentTime);
      gainNode1.gain.exponentialRampToValueAtTime(0.4, currentTime + 0.02);
      gainNode1.gain.exponentialRampToValueAtTime(0.0001, currentTime + 0.45);

      oscillator1.connect(gainNode1);
      gainNode1.connect(audioContext.destination);

      oscillator1.start(currentTime);
      oscillator1.stop(currentTime + 0.45);

      // SECOND SOUND
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();

        const secondTime = audioContext.currentTime;

        oscillator2.type = "sine";
        oscillator2.frequency.setValueAtTime(1000, secondTime);

        gainNode2.gain.setValueAtTime(0.0001, secondTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.4, secondTime + 0.02);
        gainNode2.gain.exponentialRampToValueAtTime(0.0001, secondTime + 0.45);

        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        oscillator2.start(secondTime);
        oscillator2.stop(secondTime + 0.45);
      }, 500);

    } catch (error) {
      console.error("Unable to play reminder sound:", error);
    }
  };

  // =====================================================
  // REMINDER TOGGLE
  // =====================================================

  const toggleReminder = () => {
    const newReminderStatus = !reminder;
    setReminder(newReminderStatus);
    soundPlayedRef.current = false;
    playReminderSound();
  };

  // =====================================================
  // AUTOMATIC REMINDER SOUND
  // =====================================================

  useEffect(() => {
    if (
      reminder &&
      reminderFestivals.length > 0 &&
      !soundPlayedRef.current
    ) {
      playReminderSound();
      soundPlayedRef.current = true;
    }

    if (reminderFestivals.length === 0) {
      soundPlayedRef.current = false;
    }
  }, [reminder, reminderFestivals.length]);

  // =====================================================
  // BROWSER NOTIFICATION
  // =====================================================

  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Your browser does not support notifications.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      alert("Festival notifications enabled successfully!");
      localStorage.setItem("notificationPermission", "granted");
    }
  };

  // =====================================================
  // CALENDAR FUNCTIONS
  // =====================================================

  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const previousMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();

  const calendarDays = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: previousMonthDays - i,
      currentMonth: false,
      month: selectedMonth - 1,
      year: selectedYear,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      currentMonth: true,
      month: selectedMonth,
      year: selectedYear,
    });
  }

  // Next month days
  let nextDay = 1;
  while (calendarDays.length < 42) {
    calendarDays.push({
      day: nextDay,
      currentMonth: false,
      month: selectedMonth + 1,
      year: selectedYear,
    });
    nextDay++;
  }

  // ================= MONTH NAVIGATION =================

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
    setSelectedDate(null);
  };

  // ================= FESTIVAL FOR DATE =================

  const getFestivalForDate = (day, month, year) => {
    return allFestivals.filter((festival) => {
      const festivalDate = convertDate(festival.date);

      return (
        festivalDate.getDate() === day &&
        festivalDate.getMonth() === month &&
        festivalDate.getFullYear() === year &&
        festival.name.toLowerCase().includes(search.toLowerCase())
      );
    });
  };

  // ================= TODAY CHECK =================

  const isToday = (day, month, year) => {
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  // ================= SELECTED CHECK =================

  const isSelected = (day, month, year) => {
    if (!selectedDate) return false;
    return (
      selectedDate.day === day &&
      selectedDate.month === month &&
      selectedDate.year === year
    );
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <section className="min-h-screen bg-[#f8f5ef] py-6 sm:py-8 lg:py-10 px-3 sm:px-5 lg:px-8">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="relative overflow-hidden rounded-3xl border border-[#e4cfaa] bg-gradient-to-br from-[#fff8e8] via-[#faf4e8] to-[#edf5eb] shadow-lg px-5 py-7 sm:px-8 sm:py-9 mb-7">

          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#d4a373]/10" />
          <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-[#2f5d34]/10" />

          <div className="relative z-10">

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🌿</span>
              <p className="uppercase tracking-[0.22em] sm:tracking-[0.3em] text-[#4d7a53] text-xs sm:text-sm font-bold">
                Cultural Calendar
              </p>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f5d34] leading-tight">
              Maharashtra Festival Calendar
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-[#d4a373] text-lg">✦</span>
              <p className="text-gray-600 text-sm sm:text-base">
                Explore Maharashtra's famous festivals month by month.
              </p>
            </div>

          </div>

        </div>

        {/* ================= SEARCH ================= */}

        <div className="bg-white rounded-2xl shadow-md border border-[#eadcc5] p-3 sm:p-4 mb-6">

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl">
              🔍
            </span>

            <input
              type="text"
              placeholder={t("searchFestival")} // ✅ TRANSLATED
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[#d4a373] rounded-xl pl-11 sm:pl-12 pr-10 py-3 sm:py-4 text-sm sm:text-base text-gray-700 bg-[#fffdf9] focus:outline-none focus:ring-2 focus:ring-[#2f5d34] focus:border-[#2f5d34] transition"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2f5d34] text-lg"
              >
                ✕
              </button>
            )}

          </div>

        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* CALENDAR */}
          <div className="lg:col-span-9">

            <div className="bg-white rounded-2xl shadow-lg border border-[#eadcc5] overflow-hidden">

              {/* CALENDAR HEADER */}
              <div className="px-4 sm:px-6 py-4 border-b border-[#eadcc5] bg-gradient-to-r from-[#fffaf0] to-[#eef5ea]">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={goToPreviousMonth}
                    className="w-10 h-10 rounded-xl border border-[#e4cfaa] bg-white text-[#2f5d34] text-xl font-bold hover:bg-[#eef5ea] transition"
                  >
                    ‹
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2f5d34]">
                      {monthNames[selectedMonth]} {selectedYear}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="w-10 h-10 rounded-xl border border-[#e4cfaa] bg-white text-[#2f5d34] text-xl font-bold hover:bg-[#eef5ea] transition"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* WEEK DAYS */}
              <div className="grid grid-cols-7 border-b border-[#eadcc5]">
                {weekDays.map((day, index) => (
                  <div
                    key={day}
                    className={`py-3 text-center text-xs sm:text-sm font-bold ${
                      index === 0 ? "text-red-600" : index === 6 ? "text-blue-600" : "text-gray-700"
                    } bg-[#fffdf8]`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* CALENDAR DAYS */}
              <div className="grid grid-cols-7">
                {calendarDays.map((calendarDay, index) => {

                  const festivalsForDay = getFestivalForDate(calendarDay.day, calendarDay.month, calendarDay.year);
                  const todayDate = isToday(calendarDay.day, calendarDay.month, calendarDay.year);
                  const selected = isSelected(calendarDay.day, calendarDay.month, calendarDay.year);
                  const hasFestival = festivalsForDay.length > 0;

                  return (
                    <button
                      key={`${calendarDay.year}-${calendarDay.month}-${calendarDay.day}-${index}`}
                      type="button"
                      onClick={() => {
                        if (calendarDay.currentMonth) {
                          setSelectedDate({
                            day: calendarDay.day,
                            month: calendarDay.month,
                            year: calendarDay.year,
                          });
                        }
                      }}
                      className={`
                        relative min-h-[82px] sm:min-h-[100px]
                        border-r border-b border-[#eee6d8]
                        p-1.5 sm:p-2 text-left transition-all
                        ${!calendarDay.currentMonth ? "bg-[#faf9f6] text-gray-300" : "bg-white hover:bg-[#fffaf0]"}
                        ${todayDate ? "bg-[#eef5ea]" : ""}
                        ${selected ? "ring-2 ring-inset ring-[#2f5d34] bg-[#eef5ea]" : ""}
                      `}
                    >
                      <div
                        className={`
                          text-sm sm:text-base font-bold
                          ${!calendarDay.currentMonth ? "text-gray-300" : index % 7 === 0 ? "text-red-600" : index % 7 === 6 ? "text-blue-600" : "text-gray-800"}
                        `}
                      >
                        {calendarDay.day}
                      </div>

                      {todayDate && (
                        <span className="absolute top-1 right-1 text-[8px] sm:text-[9px] bg-[#2f5d34] text-white px-1.5 py-0.5 rounded-full font-bold">
                          TODAY
                        </span>
                      )}

                      {hasFestival && (
                        <div className="mt-1 space-y-1">
                          {festivalsForDay.slice(0, 2).map((festival) => (
                            <div key={festival.name} className="rounded-lg bg-[#fff4d6] border border-[#e7c36b] px-1.5 py-1">
                              <div className="flex items-center gap-1">
                                <span className="text-xs sm:text-sm">
                                  {festivalIcons[festival.name] || "🌸"}
                                </span>
                                <span className="text-[9px] sm:text-[11px] font-bold text-[#8b4b08] truncate">
                                  {festival.name}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* SELECTED FESTIVAL INFO */}
              {selectedDate && (
                <div className="p-4 sm:p-5 border-t border-[#eadcc5] bg-gradient-to-r from-[#fffaf0] to-[#eef5ea]">
                  <p className="text-xs uppercase tracking-wider text-[#8b4b08] font-bold mb-2">
                    Selected Date
                  </p>
                  <p className="text-lg font-bold text-[#2f5d34]">
                    {selectedDate.day} {monthNames[selectedDate.month]} {selectedDate.year}
                  </p>

                  {getFestivalForDate(selectedDate.day, selectedDate.month, selectedDate.year).length > 0 ? (
                    <div className="mt-2">
                      {getFestivalForDate(selectedDate.day, selectedDate.month, selectedDate.year).map((festival) => (
                        <p key={festival.name} className="text-sm font-semibold text-gray-700">
                          {festivalIcons[festival.name] || "🌸"} {festival.name}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      No festival on this date.
                    </p>
                  )}
                </div>
              )}

              {/* CALENDAR LEGEND */}
              <div className="px-4 sm:px-6 py-4 bg-[#fffdf9] border-t border-[#eadcc5]">
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#fff4d6] border border-[#e7c36b]" />
                    <span className="text-gray-600">Festival</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#eef5ea] border border-[#9ac39c]" />
                    <span className="text-gray-600">Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded border-2 border-[#2f5d34]" />
                    <span className="text-gray-600">Selected Date</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-3 space-y-5">

            {/* UPCOMING */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e4d5bb]">
              <div className="bg-gradient-to-r from-[#eef5ea] to-[#fff6df] px-4 sm:px-5 py-4 border-b border-[#eadcc5]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📅</span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#2f5d34]">
                    {t("upcoming")} {/* ✅ TRANSLATED */}
                  </h2>
                </div>
              </div>

              <div className="p-4">
                {upcomingFestivals.length > 0 ? (
                  upcomingFestivals.map((festival, index) => (
                    <div key={`${festival.name}-${index}`} className="flex gap-3 py-3 border-b border-gray-200 last:border-b-0">
                      <div className="min-w-[50px] h-[50px] rounded-xl bg-[#f4ead7] flex flex-col items-center justify-center text-[#2f5d34] font-bold border border-[#e5cfaa]">
                        <span className="text-base">{festival.date.split(" ")[0]}</span>
                        <span className="text-[10px] uppercase">{festival.date.split(" ")[1]}</span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{festivalIcons[festival.name] || "🌸"}</span>
                          <p className="font-bold text-gray-800 text-xs sm:text-sm">{festival.name}</p>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">{festival.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm py-4">
                    {t("noFestivals")} {/* ✅ TRANSLATED */}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => navigate("/festivals/full")}
                  className="w-full mt-4 py-3 rounded-xl bg-[#2f5d34] text-white font-semibold text-sm hover:bg-[#244b29] hover:shadow-lg transition-all duration-300"
                >
                  📅 {t("viewFull")} {/* ✅ TRANSLATED */}
                </button>
              </div>
            </div>

            {/* REMINDER */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#e7c36b] overflow-hidden">
              <div className="bg-gradient-to-r from-[#fff4d6] to-[#fffaf0] px-4 sm:px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔔</span>
                    <h2 className="text-base sm:text-lg font-bold text-[#8b4b08]">
                      {t("reminder")} {/* ✅ TRANSLATED */}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={toggleReminder}
                    aria-label="Toggle festival reminder"
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      reminder ? "bg-[#2f5d34]" : "bg-gray-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                      reminder ? "right-0.5" : "left-0.5"
                    }`} />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {reminder ? (
                  <>
                    <div className="bg-[#eef5ea] rounded-xl p-4 mb-3 border border-[#d9e8d5]">
                      <div className="flex gap-3">
                        <span className="text-xl">🔔</span>
                        <div>
                          <p className="text-[#2f5d34] font-semibold text-sm">Reminder is ON</p>
                          <p className="text-gray-600 text-xs mt-1">Festival reminders and sound are enabled.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#fff5d8] rounded-xl p-4 border border-[#f0d895]">
                      <p className="text-[#8b4b08] font-semibold text-sm">⏰ Reminder Schedule</p>
                      <p className="text-[#6b4a15] font-bold mt-1">10 days before each festival</p>
                    </div>

                    <div className="mt-3 bg-[#eef5ea] rounded-xl p-3 border border-[#d9e8d5]">
                      <p className="text-[#2f5d34] text-xs font-semibold">🔊 Reminder Sound is ON</p>
                      <p className="text-gray-600 text-xs mt-1">Sound plays when the reminder is turned ON/OFF or when an active reminder is detected.</p>
                    </div>

                    <button
                      type="button"
                      onClick={enableNotifications}
                      className="w-full mt-3 py-2.5 rounded-xl border-2 border-[#2f5d34] text-[#2f5d34] font-semibold text-sm hover:bg-[#eef5ea] transition"
                    >
                      🔔 Enable Browser Notifications
                    </button>

                    {reminderFestivals.length > 0 && (
                      <div className="mt-3 bg-[#fff4d6] rounded-xl p-3 border border-[#f0d895]">
                        <p className="text-[#8b4b08] text-xs font-semibold">🔔 Reminder period active for:</p>
                        {reminderFestivals.map((festival) => (
                          <p key={festival.name} className="text-sm font-bold text-[#6b4a15] mt-1">
                            {festivalIcons[festival.name] || "🌸"} {festival.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-600 text-sm">🔕 Festival reminders are turned off.</p>
                    <p className="text-xs text-gray-400 mt-1">Turn on the reminder to enable festival reminders and sound.</p>
                  </div>
                )}
              </div>
            </div>

            {/* CULTURAL NOTE */}
            <div className="rounded-2xl p-5 bg-[#2f5d34] text-white shadow-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌿</span>
                <div>
                  <h3 className="font-bold text-base">Maharashtra Culture</h3>
                  <p className="text-white/80 text-xs leading-relaxed mt-2">
                    Discover Maharashtra's traditional festivals, celebrations and cultural heritage throughout the year.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="flex items-center justify-center gap-3 mt-8 sm:mt-10">
          <div className="h-px bg-[#d4a373] w-16 sm:w-24" />
          <span className="text-xl sm:text-2xl text-[#d4a373]">✦</span>
          <div className="h-px bg-[#d4a373] w-16 sm:w-24" />
        </div>

      </div>

    </section>
  );
};

export default FestivalCalendar;