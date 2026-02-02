import type { TicketDetail } from "../types/ticket";

const API_URL = "http://localhost:8080/api";

export const ticketService = {
  async buyTicket(showtimeId: number, seatNumber: number) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Giriş yapmalısınız!");

    const response = await fetch(`${API_URL}/tickets/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        showtime_id: showtimeId,
        seat_number: seatNumber,
        card_number: "1234123412341234"
      }),
    });


    const textData = await response.text(); 
    console.log("🛑 BACKEND NE GÖNDERDİ?:", textData); 

    if (!textData) {
        throw new Error("Sunucudan boş cevap döndü!");
    }


    let data;
    try {
        data = JSON.parse(textData);
    } catch (e) {
        throw new Error("Sunucu JSON döndürmedi: " + textData);
    }


    if (!response.ok) {
      throw new Error(data.error || "İşlem başarısız");
    }

    return data;
  },

  async getBookedSeats(showtimeId: number): Promise<number[]> {
    const response = await fetch(`${API_URL}/showtimes/${showtimeId}/booked-seats`);
    
    if (!response.ok) {
      return [];
    }

    return response.json();
  },

  async getMyTickets(): Promise<TicketDetail[]> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Giriş yapmalısınız");

    const response = await fetch(`${API_URL}/tickets/my-tickets`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Biletler yüklenemedi");
    return response.json();
  }
};