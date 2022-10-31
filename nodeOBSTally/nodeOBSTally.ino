int red = 3;
int green = 2;

void setup() 
{
  Serial.begin(9600);
  pinMode(green, OUTPUT);
  pinMode(red, OUTPUT);
  digitalWrite(green, HIGH);
  digitalWrite(red, HIGH);
}

void loop() 
{
  if(Serial.available())
  {
    char status = Serial.read();
    if (status == '0'){ // safe
      digitalWrite(green, HIGH);
      digitalWrite(red, LOW);
    }
    else if (status == '1') { // on air
      digitalWrite(green, LOW);
      digitalWrite(red, HIGH);
    }
    else if (status == '2'){ // orange
      digitalWrite(green, HIGH);
      digitalWrite(red, HIGH);
    }
  }
}
